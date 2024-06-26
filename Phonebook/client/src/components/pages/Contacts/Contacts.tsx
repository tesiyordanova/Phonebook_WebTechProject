import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IContact } from '../../../models/contact';
import defaultProfilePicture from '../../../user_profile.png';
import ContactForm from '../../shared/contact-form/ContactForm';
import ContactInfo from '../../shared/contact-form/ContactInfo';
import styles from './Contacts.module.css';

const Contacts: React.FC = () => {
    const [contacts, setContacts] = useState<IContact[] | null>(null);
    const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
    const [creatingNewContact, setCreatingNewContact] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/contacts');
            const sortedContacts = res.data.contacts.sort((a: IContact, b: IContact) =>
                a.firstName.localeCompare(b.firstName)
            );
            setContacts(sortedContacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleContactSubmit = () => {
        fetchContacts();
        setCreatingNewContact(false);
        setSelectedContact(null); 
    };

    const handleDeleteContact = async (contactId: string) => {
        try {
            await axios.delete(`/contacts/${contactId}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const openContactForm = (contact: IContact | null) => {
        setSelectedContact(contact);
        setCreatingNewContact(true);
    };

    const handleCancel = () => {
        setCreatingNewContact(false);
        setSelectedContact(null);
    };

    const filteredContacts = contacts
        ? contacts.filter((contact) =>
              `${contact.firstName} ${contact.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
          )
        : [];

    const groupContactsByLetter = () => {
        const groupedContacts: { [letter: string]: IContact[] } = {};
        filteredContacts.forEach((contact) => {
            const firstLetter = contact.firstName.charAt(0).toUpperCase();
            if (!groupedContacts[firstLetter]) {
                groupedContacts[firstLetter] = [];
            }
            groupedContacts[firstLetter].push(contact);
        });
        return groupedContacts;
    };

    const groupedContacts = groupContactsByLetter();

    const handleContactClick = (contact: IContact) => {
        setSelectedContact(contact);
    };

    const handleCloseClick = () => {
        setSelectedContact(null);
    };

    const handleDeleteButtonClick = async (contactId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); 
    
        try {
            await axios.delete(`/contacts/${contactId}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.title}>Contacts</h2>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button
                        className={styles.addButton}
                        onClick={() => openContactForm(null)} 
                    >
                        Create New Contact
                    </button>
                </div>
                <div className={styles.contactsList}>
                    {Object.keys(groupedContacts).map((letter) => (
                        <div key={letter}>
                            <h3>{letter}</h3>
                            <ul className={styles.contactNamesList}>
                                {groupedContacts[letter].map((contact) => (
                                    <li key={contact._id} onClick={() => handleContactClick(contact)}>
                                        <span >
                                            {contact.firstName} {contact.lastName}
                                        </span>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={(e) => handleDeleteButtonClick(contact._id, e)}
                                        >
                                            x
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {filteredContacts.length === 0 && <p>No contacts</p>}
                </div>
            </div>

            {creatingNewContact && (
                <div className={styles.modalOverlay} onClick={handleCancel}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <ContactForm
                            contact={selectedContact} 
                            onSubmit={handleContactSubmit}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}

            {selectedContact && !creatingNewContact && (
                <div className={styles.modalOverlay} onClick={() => setSelectedContact(null)}>
                    <div className={styles.info} onClick={(e) => e.stopPropagation()}>
                        <ContactInfo 
                            contact={selectedContact} 
                            onEditClick={() => openContactForm(selectedContact)} 
                            onCloseClick={handleCloseClick} 
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Contacts;
