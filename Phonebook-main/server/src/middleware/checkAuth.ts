import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../interfaces/authRequest';
import { User } from '../models/user.model';

export const checkAuth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.PhonebookAuth;
    
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        req.userId = id;
        req.user = await User.findById(id);
        if (!req.user) {
            return res.status(403).send('Forbidden!');
        }

        next();
    } catch (error) {
        req.userId = null;
        req.user = null;
        
        next();
    }
};
