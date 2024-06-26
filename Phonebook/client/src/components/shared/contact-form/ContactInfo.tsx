import React from 'react';
import { IContact } from '../../../models/contact';
import defaultProfilePicture from '../../../user_profile.png';
import styles from './ContactInfo.module.css'; // Import CSS module

interface ContactInfoProps {
    contact: IContact;
    onEditClick: () => void;
    onCloseClick: () => void; // Add close click handler prop
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contact, onEditClick, onCloseClick }) => { // Include onCloseClick here
    const { firstName, lastName, address, phoneNumbers, pictureUrl } = contact;

    return (
        <div className={styles.contactInfo}>
            <div className={styles.top}>
                <div className={styles.topButtons}>
                  <button className={styles.closeButton} onClick={onCloseClick}>X</button>
                  <button className={styles.editButton} onClick={onEditClick}>Edit</button>
                </div>
                <div className={styles.profilePicture}>
                    <img src={pictureUrl || defaultProfilePicture} alt="Contact" />
                </div>
                <div className={styles.name}>
                    <label>{firstName} {lastName}</label>
                </div>
            </div>
            <div className={styles.phoneNumbers}>
                {phoneNumbers.map((phone, index) => (
                    <div key={index}>
                        <label className={styles.phoneType}>{phone.type}</label><br />
                        <label className={styles.phoneNumber}>{phone.number}</label>
                    </div>
                ))}
            </div>
            <label>{address}</label>
            {address && <div className={styles.address}>
                <label>Address:</label> <br />
                <label>{address}</label>
            </div>}
        </div>
    );
};

export default ContactInfo;
