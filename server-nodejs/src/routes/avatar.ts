// Imports
import express from 'express';
import Middleware from '../middleware';
const router = express.Router();
import AvatarService from '../services/files/avatar_service';
import uploadAvatar from '../helpers/multer';
router.put(
	'/files/avatar/upload',
	Middleware.authUser,
	uploadAvatar.single('avatar'),
	AvatarService.uploadAvatar
);
router.delete(
	'/files/avatar/delete',
	Middleware.authUser,
	AvatarService.deleteAvatar
);
export default router;
