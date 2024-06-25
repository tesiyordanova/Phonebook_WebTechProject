import { Request } from 'express';
import { IUser } from './user';

export interface IAuthRequest extends Request {
    userId?: string | null;
    user?: IUser | null;
}
