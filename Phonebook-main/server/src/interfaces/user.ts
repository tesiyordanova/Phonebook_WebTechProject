import { IContact } from './contact';

export interface IUser {
    _id: string;
    username: string;
    passwordHash: string;
    email: string
    contacts?: IContact[];
}
