import mongoose from "mongoose"
import { IUser } from "../interfaces/user";

const UserSchema = new mongoose.Schema<IUser & mongoose.Document>({
    username: {
        type: String,
        required: true,
        uniqie: true,
        lowercase: true,
        index: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

export const User = mongoose.model<IUser & mongoose.Document>('User', UserSchema);
