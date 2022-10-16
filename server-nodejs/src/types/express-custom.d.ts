import { Request } from 'express';

export interface IUserFromCookieInRequest extends Request {
  user?: {
    id: number;
    username: string;
    password: string;
    roleFk: number;
  };
}
