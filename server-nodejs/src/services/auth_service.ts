import db from './db';
import config from '../config.json';
import bycrypt from 'bcrypt';
import sendResponse from '../helpers/sendResponse';
import speakeasy from 'speakeasy';
import {
	validateEmail,
	validatePassword,
	validateUsername,
} from '../helpers/validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as redis from 'redis';
import middleware from '../middleware';
import { Request, Response } from 'express';
import { IUserFromCookieInRequest } from '../types/express-custom';
import { IAccessTokenPayload } from '../types/jwt-payload';

const redisClient = redis.createClient({
	url: (
		'redis://' +
		config.REDIS.host +
		':' +
		config.REDIS.port
	).toString(),
	//   legacyMode: true,
});

// const redisClient = redis.createClient({
// 	config.REDIS_HOST: string,
// 	port: config.REDIS_PORT,
// 	password: config.REDIS_PASSWORD,
// });

// const redisClient = redis.createClient({
// 	host: config.REDIS.host,
// 	port: config.REDIS.port,
// });

redisClient.on('error', (err) => {
	console.log('Error ' + err);
});

redisClient.on('connect', () => {
	console.log('Connected to Redis');
});

redisClient.connect();

// Prevent brute force attacks
const failures: { [key: string]: { count: number; nextTry: Date } } = {};
/**
 * Stores the login failure information in the session.
 * @param {string} remoteIp The remote IP address.
 */
function onLoginFail(remoteIp: string) {
	const f = (failures[remoteIp] = failures[remoteIp] || {
		count: 0,
		nextTry: new Date(),
	});
	++f.count;
	if (f.count % 3 == 0) {
		f.nextTry.setTime(Date.now() + 1000 * 60 * 1); // 2 minutes
	}
}

/**
 * Remove the login failure information from the session.
 * @param {string} remoteIp The remote IP address.
 */
function onLoginSuccess(remoteIp: string) {
	delete failures[remoteIp];
}

// Clean up people that have given up
const MINS10 = 600000;
const MINS30 = 3 * MINS10;
setInterval(function () {
	for (const ip in failures) {
		if (Date.now() - failures[ip].nextTry.getTime() > MINS30) {
			delete failures[ip];
		}
	}
}, MINS30);

const AuthService = {
	logout: async (req: Request, res: Response) => {
		const { refreshToken } = req.body;
		res.clearCookie('jwt');
		if (!refreshToken) {
			return sendResponse.authError(res, 'No refresh token');
		}
		const tokenInRedis = await redisClient.get(refreshToken);
		if (!tokenInRedis) {
			return sendResponse.error(res, 'Invalid refresh token');
		}
		await redisClient.del(refreshToken);
		sendResponse.success(res, 'Logged out');
	},
	login: async (req: Request, res: Response) => {
		const { email, password, totpCode } = req.body;
		if (!email || !password) {
			sendResponse.missingParams(
				res,
				'Email or password missing'
			);
			return;
		}
		if (!validateEmail(email)) {
			sendResponse.error(res, 'Invalid email - regex');
			return;
		}
		const remoteIp = req.ip;
		const f = failures[remoteIp];
		if (f && Date.now() < f.nextTry.getTime()) {
			sendResponse.error(
				res,
				'Too many failed attempts. Please try again later.'
			);
			return;
		}
		let user = await db.query(
			'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id LEFT JOIN avatar ON avatar.userFk = user.id WHERE email = ?',
			[email.toLowerCase()]
		);
		if (user && user.length === 0) {
			onLoginFail(remoteIp);
			sendResponse.error(res, 'User not found');
			return;
		}
		user = user[0];

		const match = await bycrypt.compare(password, user.password);
		if (!match) {
			onLoginFail(remoteIp);
			sendResponse.error(res, 'Credentials do not match');
			return;
		}
		if (user.secretBase32 && user.verified) {
			if (!totpCode) {
				return sendResponse.error(res, '2FA required');
			}
			const verified = speakeasy.totp.verify({
				secret: user.secretBase32,
				encoding: 'base32',
				token: totpCode,
			});
			if (!verified) {
				return sendResponse.error(
					res,
					'Invalid 2FA code'
				);
			}
		}

		onLoginSuccess(remoteIp);
		user = {
			id: user.id,
			username: user.username,
			email: user.email,
			roleFk: user.roleFk,
			avatar: user.generatedPath,
		};
		createAndSendTokens(res, user);
	},
	register: async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			console.log('Missing : ', username, email, password);
			sendResponse.missingParams(
				res,
				'username, email or password'
			);
			return;
		}
		// Check if user already exists
		let user = await db.query(
			'SELECT * FROM user WHERE username = ? OR email = ?',
			[username, email]
		);

		if (user.length > 0) {
			sendResponse.error(res, 'User already exists');
			return;
		}
		if (password.length < 8) {
			sendResponse.error(
				res,
				'Password must be at least 8 characters long'
			);
			return;
		}
		if (!validateEmail(email)) {
			sendResponse.error(res, 'Invalid email');
			return;
		}
		if (!validatePassword(password)) {
			sendResponse.error(res, 'Password is too weak');
			return;
		}
		if (!validateUsername(username)) {
			sendResponse.error(
				res,
				'Username - only letters, numbers, underscore and hyphen allowed (min 3, max 20)'
			);
			return;
		}
		// Hash password
		const hashedPassword = await bycrypt.hash(
			password,
			config.BCRYPT_ROUNDS
		);
		// Create user
		user = await db.query(
			'INSERT INTO user (username, email, password, roleFk) VALUES (?, ?, ?, 1)',
			[username, email, hashedPassword]
		);
		if (!user) {
			sendResponse.error(res, 'Could not create user');
			return;
		}
		user = {
			id: user.insertId,
			username,
			email,
			roleFk: 1,
			avatar: null,
		};

		createAndSendTokens(res, user);
	},
	// Before verifying
	enable2FA: async (req: IUserFromCookieInRequest, res: Response) => {
		const { password } = req.body;
		const requestingUser = req.user;
		const email = requestingUser?.email;
		if (!email || !password) {
			console.log('Missing : ', email, password);
			sendResponse.missingParams(res, 'email or password');
			return;
		}
		// Check if user already has 2FA
		let user = await db.query(
			'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id WHERE email = ?',
			[email]
		);
		if (user.length === 0) {
			return sendResponse.error(res, 'User not found');
		}
		user = user[0];
		if (user.secretBase32 && user.verified) {
			return sendResponse.error(res, 'User already has 2FA');
		} else if (user.secretBase32 && !user.verified) {
			console.log(
				'User has 2FA but not verified - deleting and re-creating'
			);
			await db.query(
				'DELETE FROM user_2fa WHERE userFk = ?',
				[user.id]
			);
		}

		// Verify password
		const match = await bycrypt.compare(password, user.password);
		if (!match) {
			return sendResponse.error(
				res,
				'Credentials do not match'
			);
		}
		const secret = speakeasy.generateSecret({
			otpauth_url: true,
			name: config.MFA_Issuer + ' (' + user.email + ')',
		});
		const url = secret.otpauth_url;
		const secretBase32 = secret.base32;
		const dbResult = await db.query(
			'INSERT INTO user_2fa (userFk, secretBase32) VALUES (?, ?)',
			[user.id, secretBase32]
		);
		if (!dbResult) {
			sendResponse.error(res, 'Could not create 2FA');
			return;
		}
		sendResponse.success(res, {
			url,
			secretBase32,
		});
	},
	// After enabling
	verify2FA: async (req: IUserFromCookieInRequest, res: Response) => {
		const { currentCode } = req.body;
		const requestingUser = req.user;
		const email = requestingUser?.email;
		if (!email || !currentCode) {
			console.log('Missing : ', email, currentCode);
			return sendResponse.missingParams(
				res,
				'email or currentCode'
			);
		}
		// Check if user already has 2FA
		let user = await db.query(
			'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id WHERE email = ? ',
			[email]
		);
		if (user.length === 0) {
			return sendResponse.error(res, 'User not found');
		}
		user = user[0];
		if (!user.secretBase32) {
			return sendResponse.error(
				res,
				'User does not have 2FA'
			);
		}
		if (user.verified) {
			return sendResponse.error(res, '2FA already verified');
		}
		const verified = speakeasy.totp.verify({
			secret: user.secretBase32,
			encoding: 'base32',
			token: currentCode,
		});
		if (!verified) {
			return sendResponse.error(res, 'Invalid code');
		}
		const dbResult = await db.query(
			'UPDATE user_2fa SET verified = 1 WHERE userFk = ?',
			[user.id]
		);
		if (!dbResult) {
			sendResponse.error(res, 'Could not verify 2FA');
			return;
		}
		sendResponse.success(res, {
			message: '2FA verified',
		});
	},
	disable2FA: async (req: IUserFromCookieInRequest, res: Response) => {
		const { password, totpCode } = req.body;
		const requestingUser = req.user;
		const email = requestingUser?.email;
		if (!email || !password || !totpCode) {
			console.log('Missing : ', email, password, totpCode);
			return sendResponse.missingParams(
				res,
				'email, password or totpCode'
			);
		}
		// Check if user already has 2FA
		let user = await db.query(
			'SELECT * FROM user LEFT JOIN user_2fa ON user_2fa.userFk = user.id WHERE email = ? ',
			[email]
		);
		if (user.length === 0) {
			return sendResponse.error(res, 'User not found');
		}
		user = user[0];
		if (!user.secretBase32 || !user.verified) {
			return sendResponse.error(
				res,
				'User does not have 2FA'
			);
		}
		// Verify password
		const match = await bycrypt.compare(password, user.password);
		if (!match) {
			return sendResponse.error(
				res,
				'Credentials do not match'
			);
		}
		// Verify 2FA
		const verified = speakeasy.totp.verify({
			secret: user.secretBase32,
			encoding: 'base32',
			token: totpCode,
		});
		if (!verified) {
			return sendResponse.error(res, 'Invalid code');
		}
		const dbResult = await db.query(
			'DELETE FROM user_2fa WHERE userFk = ?',
			[user.id]
		);
		if (!dbResult) {
			sendResponse.error(res, 'Could not disable 2FA');
			return;
		}
		sendResponse.success(res, {
			message: '2FA disabled',
		});
	},

	refreshToken: async (req: Request, res: Response) => {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) {
			sendResponse.missingParams(res, 'refreshToken');
			return;
		}
		const token = await redisClient.get(refreshToken);
		if (!token) {
			return sendResponse.error(res, 'Invalid refresh token');
		}
		const user = JSON.parse(token);
		createAndSendTokens(res, user);
		// Delete refresh token
		await redisClient.del(refreshToken);
	},
	status: async (req: Request, res: Response) => {
		const token = req.cookies.jwt;
		if (!token) {
			sendResponse.authError(res, 'No token');
			return;
		}
		try {
			const decoded = jwt.verify(
				token,
				config.JWT_SECRET
			) as IAccessTokenPayload;
			if (!decoded || !decoded.id) {
				sendResponse.authError(res, 'Invalid token');
				return;
			}
			const user = await db.query(
				'SELECT * FROM user LEFT JOIN avatar ON avatar.userFk = user.id WHERE id = ?',
				[decoded.id]
			);
			if (user.length === 0) {
				sendResponse.authError(res, 'User not found');
				return;
			}
			// console.log(user);
			const { id, username, email, roleFk, generatedPath } =
				user[0];
			sendResponse.success(res, {
				id,
				username,
				email,
				roleFk,
				avatar: generatedPath,
			});
		} catch (err) {
			middleware.catchErrorExport(err, res);
		}
	},
};

/**
 *
 * @param {
 *   id: number,
 *   username: string,
 *   email: string,
 *   roleFk: number
 *   avatar: string
 *  } user
 * @param {*} res
 */
interface User {
	id: number;
	username: string;
	email: string;
	roleFk: number;
	generatedPath: string;
}
async function createAndSendTokens(res: Response, user: User) {
	if (
		!user ||
		!user.id ||
		!user.username ||
		!user.email ||
		!user.roleFk
	) {
		sendResponse.serverError(
			res,
			'Could not create tokens - missing data'
		);
		return;
	}
	// Create Access Token
	const accessToken = jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		config.JWT_SECRET,
		{
			// 10 minutes
			expiresIn: 10,
		}
	);
	// Create Refresh Token
	const refreshToken = crypto.randomBytes(64).toString('hex');
	// Store refresh token in redis
	// console.log('refreshToken', refreshToken);
	await redisClient.set(
		refreshToken,
		JSON.stringify({
			id: user.id,
			username: user.username,
			email: user.email,
			roleFk: user.roleFk,
			avatar: user.generatedPath,
		})
	);
	await redisClient.expire(refreshToken, 60 * 60 * 24 * 7);
	const csrfToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
		expiresIn: 60 * 60 * 24 * 7,
	});
	res.cookie('jwt', accessToken, {
		httpOnly: true,
		secure: process.env.MODE !== 'DEV',
		sameSite: 'strict',
		// Max age is 7 days
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});
	sendResponse.success(res, {
		accessToken,
		refreshToken,
		csrfToken,
		user,
	});
}
export default AuthService;
