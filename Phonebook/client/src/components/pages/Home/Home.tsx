import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file for styling

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/contacts');
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to Phonebook!</h1>
                <p className="home-text">
                    Manage all your contacts efficiently with Phonebook. 
                    Keep track of your friends, family, and colleagues 
                    with ease and convenience. 
                </p>
                <p className="home-text">
                    Whether you're looking to add new contacts, update 
                    information, or simply organize your address book, 
                    Phonebook offers a simple and intuitive platform 
                    to streamline your communication needs.
                </p>
                <p className="home-text">
                    Start managing your contacts today with our easy-to-use 
                    interface and powerful features. Stay connected and 
                    organized like never before with Phonebook!
                </p>
                <button className="home-button" onClick={handleGetStarted}>Get Started</button>
            </div>
        </div>
    );
};

export default Home;
