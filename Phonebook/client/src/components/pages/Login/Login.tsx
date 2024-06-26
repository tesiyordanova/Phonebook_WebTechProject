import axios from 'axios';
import React, { useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { login } from '../../../store/features/userSlice';
import './Login.css';



const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();

    const handleusernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('/auth/login', {username,password});

            if (response.status === 200) {
                alert('User logged in successfully!');
                dispatch(login({ username }));
            }
        }

        catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data);
            }
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="login-container">
        <div className="login-left">
        <div className="login-left-content">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleusernameChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="signup-link">
                    <span>Don't have an account?</span> <button type="button" className="signup-button">Sign up</button>
                </div>
            </form>
        </div>
        </div>
        <div className="login-right">
            <div className="login-right-content">
                <h2>Welcome Back!</h2>
                    <p>Your go-to tool for efficient contact management. Login to stay connected with your contacts effortlessly.</p>
                    <p>Phonebook simplifies how you manage your contacts, ensuring you never lose touch with friends, family, or colleagues. Whether you need to update details, add new contacts, or simply keep your address book organized, our platform offers an intuitive interface designed to meet your communication needs.</p>
                    <p>Join today and start managing your contacts with ease. Stay organized and connected like never before with Phonebook!</p>
            </div>
        </div>
    </div>
);
};


export default Login;