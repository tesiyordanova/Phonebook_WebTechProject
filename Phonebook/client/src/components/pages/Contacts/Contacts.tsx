import React, { useEffect } from 'react';
import axios from 'axios';
import { IContact } from '../../../models/contact';
import defaultProfilePicture from '../../../user_profile.png';
import ContactForm from '../../shared/contact-form/ContactForm';
import styles from './Contacts.module.css';

const Contacts: React.FC = () => {
    const [contacts, setContacts] = React.useState<IContact[] | null>(null);
    const [selectedContact, setSelectedContact] = React.useState<IContact | null>(null);
    const [showContactForm, setShowContactForm] = React.useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/contacts');
            setContacts(res.data.contacts);
        }
        catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleContactSubmit = () => {
        setShowContactForm(false);
        fetchContacts();
    };

    const handleDeleteContact = async (contactId: string) => {
        try {
            await axios.delete(`/contacts/${contactId}`);
            fetchContacts();
        }
        catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.title}>Contacts</h2>
                <button className={styles.addButton} onClick={() => { setSelectedContact(null); setShowContactForm(true) }}>
                    Create New Contact
                </button>
                <div className={styles.contactsList}>
                    {contacts ? (
                        contacts.map((contact) => (
                            <div key={contact._id} className={styles.contactCard}>
                                <img
                                    src={contact.pictureUrl || defaultProfilePicture}
                                    alt="Contact image"
                                    className={`${styles.profilePicture} ${styles.profilePic}`}
                                />
                                <div className={styles.contactInfo}>
                                    <h3>{contact.firstName} {contact.lastName}</h3>
                                    <p>Address: {contact.address}</p>
                                    <h4>Phone Numbers:</h4>
                                    <ul>
                                        {contact.phoneNumbers.map((phone, index) => (
                                            <li key={index}>
                                                {phone.type}: {phone.number}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button className={styles.editButton} onClick={() => { setSelectedContact(contact); setShowContactForm(true) }}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDeleteContact(contact._id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No contacts</p>
                    )}
                </div>
            </div>

            {showContactForm && <ContactForm contact={selectedContact} onSubmit={handleContactSubmit} onCancel={() => setShowContactForm(false)} />}
        </>
    );
}

export default Contacts;
