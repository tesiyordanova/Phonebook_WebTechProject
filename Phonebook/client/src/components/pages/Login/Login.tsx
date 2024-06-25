import axios from 'axios';
import React, { useState } from 'react';

import { useAppDispatch } from '../../../store/hooks';
import { login } from '../../../store/features/userSlice';


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
            const response = await axios.post('/auth/login', {
                username,
                password
            });

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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        value={username}
                        onChange={handleusernameChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;