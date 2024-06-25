import { IContact } from "../../../models/contact";

export interface ContactFormProps {
    contact: IContact | null;
    onSubmit: () => void;
    onCancel: () => void;
}
