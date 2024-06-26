import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();

    const validateUsername = (username: string): string | null => {
        if (!username) return null; // Skip validation if empty
        if (username.length < 6 || username.length > 30) {
            return 'Username must be between 6 and 30 characters long.';
        }
        if (!/^[a-zA-Z]/.test(username)) {
            return 'Username must start with an alphabetic character.';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain alphanumeric characters and underscores.';
        }
        return null;
    };

    const validatePassword = (password: string): string | null => {
        if (!password) return null; // Skip validation if empty
        if (password.length <= 4) {
            return 'Password must be more than 4 characters long.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one digit.';
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return 'Password must contain at least one special symbol.';
        }
        return null;
    };

    useEffect(() => {
        setUsernameError(validateUsername(username));
    }, [username]);

    useEffect(() => {
        setPasswordError(validatePassword(password));
    }, [password]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match!');
        } else {
            setConfirmPasswordError(null);
        }
    }, [password, confirmPassword]);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setConfirmPassword(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate fields before submission
        setUsernameError(validateUsername(username));
        setPasswordError(validatePassword(password));
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match!');
        } else {
            setConfirmPasswordError(null);
        }

        // Check if there are any errors
        if (usernameError || passwordError || confirmPasswordError) {
            setError('Please fix the errors above before submitting.');
            return;
        }

        try {
            const response = await axios.post('/auth/signup', {
                username,
                password
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message || 'An error occurred.');
            }
            console.error('Error registering:', error);
        }
    };

    const handleLogIn = () => {
        navigate('/login'); 
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Username: <span className="required">*</span></label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                        <p className={`error-message ${usernameError ? 'active' : ''}`}>{usernameError}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: <span className="required">*</span></label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <p className={`error-message ${passwordError ? 'active' : ''}`}>{passwordError}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password: <span className="required">*</span></label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                        <p className={`error-message ${confirmPasswordError ? 'active' : ''}`}>{confirmPasswordError}</p>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                    <div className="login-link" onClick={handleLogIn}>
                        <span>Already have an account? <u>Login here</u></span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
