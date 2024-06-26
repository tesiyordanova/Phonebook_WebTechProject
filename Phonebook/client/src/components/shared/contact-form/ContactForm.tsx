import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ContactFormProps } from './ContactForm.types';
import defaultProfilePicture from '../../../user_profile.png';
import './ContactForm.styles.css';

interface IContactForm {
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumbers: {
        type: string;
        number: string;
    }[];
    pictureFile?: File | null;
    deletePicture?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit, onCancel }) => {
    const [createForm, setCreateForm] = useState<IContactForm>({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumbers: [
            {
                type: '',
                number: ''
            }
        ],
        pictureFile: null,
        deletePicture: false
    });

    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (contact) {
            setCreateForm({
                firstName: contact.firstName,
                lastName: contact.lastName || '',
                address: contact.address || '',
                phoneNumbers: contact.phoneNumbers
            });
        }
        else {
            setCreateForm({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumbers: [
                    {
                        type: '',
                        number: ''
                    }
                ]
            });
        }
    }, [contact]);

    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); 
  
    const fileInput = useRef<HTMLInputElement>(null);
    
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length) {
        setCreateForm({ ...createForm, pictureFile: event.target.files[0] });
        setImagePreviewUrl(window.URL.createObjectURL(event.target.files[0]));
      } else {
        setCreateForm({ ...createForm, pictureFile: null });
        setImagePreviewUrl(null);
      }
    };

    const onRemovePictureClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      setCreateForm({ ...createForm, pictureFile: null, deletePicture: true });
      setImagePreviewUrl(null);
      fileInput.current!.value = '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCreateForm({ ...createForm, [name]: value });
        setInputErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }

    const handlePhoneNumberChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const phoneNumbers = [...createForm.phoneNumbers];
        phoneNumbers[index] = { ...phoneNumbers[index], [name]: value };
        setCreateForm({ ...createForm, phoneNumbers });
        setInputErrors(prevErrors => ({ ...prevErrors, [`phoneType_${index}`]: '', [`phoneNumber_${index}`]: '' }));
    };

    const handleAddPhoneNumber = () => {
        setCreateForm({ ...createForm, phoneNumbers: [...createForm.phoneNumbers, { type: '', number: '' }] });
    };

    
    const handleRemovePhoneNumber = (index: number) => {
        const phoneNumbers = createForm.phoneNumbers.filter((_, i) => i !== index);
        setCreateForm({ ...createForm, phoneNumbers });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate required fields
        const errors: { [key: string]: string } = {};
        if (!createForm.firstName.trim()) {
            errors.firstName = 'Invalid input.';
        }
        if (!createForm.phoneNumbers.every((phone, index) => phone.type && phone.number.length === 10)) {
            createForm.phoneNumbers.forEach((phone, index) => {
                if (!phone.type) errors[`phoneType_${index}`] = 'Invalid input.';
                if (phone.number.length !== 10) errors[`phoneNumber_${index}`] = 'Invalid input.';
            });
        }

        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('firstName', createForm.firstName);
            if (createForm.lastName.trim()) {
                formData.append('lastName', createForm.lastName);
            }
            if (createForm.address?.trim()) {
                formData.append('address', createForm.address);
            }
            formData.append('phoneNumbers', JSON.stringify(createForm.phoneNumbers));
            if (createForm.deletePicture) {
                formData.append('deletePicture', 'true');
            }            
            if (createForm.pictureFile) {
                formData.append('pictureFile', createForm.pictureFile);
            }
            
            if (contact) {
                await axios.put(`/contacts/${contact._id}`, formData);
                onSubmit();
            }
            else {
                await axios.post('/contacts', formData);
                onSubmit();
            }
        } catch (error) {
            console.error('Error creating contact:', error);
        }
    };

    const handleCancel = () => {
        setInputErrors({});
        onCancel();
    }

    return (
        <div className="contact-form-container">
            <form onSubmit={handleSubmit} noValidate>
                <h2>{!!contact ? 'Update Contact' : 'Create Contact'}</h2>
                <div>
                    <label>First Name: <span className="required">*</span></label>
                    <input
                        type="text"
                        name="firstName"
                        value={createForm.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    {inputErrors.firstName && <span className="validation-error">{inputErrors.firstName}</span>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={createForm.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Picture:</label>
                    <div>
                    { imagePreviewUrl
                        ? <img src={imagePreviewUrl} alt="Contact image" width={'100px'} height={'100px'}/>
                        : contact?.pictureUrl && !createForm.deletePicture
                            ? <img src={contact?.pictureUrl} alt="Contact image" width={'100px'} height={'100px'}/>
                            : <img src={defaultProfilePicture} alt="Contact image" width={'100px'} height={'100px'} />}
                    </div>
                    <button type="button" onClick={() => fileInput.current?.click()}>Select Picture</button>
                    <button type="button" onClick={onRemovePictureClick}>Remove Picture</button>
                    <input
                        style={{ display: 'none' }}
                        ref={fileInput}
                        type="file"
                        name="pictureFile"
                        accept="image/jpeg,image/png"
                        onChange={onImageChange}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={createForm.address}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <h4>Phone Numbers: <span className="required">*</span></h4>
                    {createForm.phoneNumbers.map((phone, index) => (
                        <div key={index}>
                            <select
                                name="type"
                                value={phone.type}
                                onChange={(e) => handlePhoneNumberChange(index, e)}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="mobile">Mobile</option>
                                <option value="work">Work</option>
                                <option value="home">Home</option>
                                <option value="other">Other</option>
                            </select>
                            <input
                                type="text"
                                name="number"
                                value={phone.number}
                                onChange={(e) => handlePhoneNumberChange(index, e)}
                                required
                            />
                            {inputErrors[`phoneType_${index}`] && <span className="validation-error">{inputErrors[`phoneType_${index}`]}</span>}
                            {inputErrors[`phoneNumber_${index}`] && <span className="validation-error">{inputErrors[`phoneNumber_${index}`]}</span>}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPhoneNumber}>
                        Add Phone Number
                    </button>
                </div>
                <div className="bottom">
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
