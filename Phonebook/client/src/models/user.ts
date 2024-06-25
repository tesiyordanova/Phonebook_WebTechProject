import { IContact } from "./contact";

export interface IUser {
    username: string;
    passwordHash: string;
    contacts?: IContact[];
}
