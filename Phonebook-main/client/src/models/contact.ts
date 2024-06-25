export enum PhoneNumberType {
    mobile = 'mobile',
    work = 'work',
    home = 'home',
    other = 'other'
}

export interface IPhoneNumber {
    type: PhoneNumberType;
    number: string;
}

export interface IContact {
    _id: string;
    firstName: string;
    lastName?: string | null;
    picture?: string | null;
    pictureUrl?: string | null;
    phoneNumbers: IPhoneNumber[];
    address?: string | null;
}
