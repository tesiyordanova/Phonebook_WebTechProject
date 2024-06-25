import { IContact } from "../../interfaces/contact";

export interface IContactResponse extends IContact {
    pictureUrl: string | null;
}