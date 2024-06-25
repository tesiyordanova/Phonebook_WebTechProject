import mongoose from "mongoose"
import { IContact, IPhoneNumber, PhoneNumberType } from "../interfaces/contact";


const phoneNumberSchema = new mongoose.Schema<IPhoneNumber & mongoose.Document>({
    type: { type: String, enum: Object.values(PhoneNumberType), required: true },
    number: { type: String, required: true}
})

const constactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    phoneNumbers: { type: [phoneNumberSchema], required: true },
    lastName: String,
    picture: String,
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export const PhoneNumber = mongoose.model<IPhoneNumber & mongoose.Document>('PhoneNumber', phoneNumberSchema);
export const Contact = mongoose.model<IContact & mongoose.Document>('Contact', constactSchema);
