import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout, selectUser } from '../../../store/features/userSlice';
import Cookies from 'js-cookie';
import axios from 'axios';
import './NavBar.css'; // Import your CSS file for styling

const NavBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUser)?.username;
    const isLoggedIn = !!username;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
            dispatch(logout());
            Cookies.remove('PhonebookAuth'); // Remove the authentication cookie
            navigate('/');
            window.location.reload(); // Force reload to ensure state is reset
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    {isLoggedIn && (
                        <li className="nav-item">
                            <Link to="/contacts" className="nav-link">Contacts</Link>
                        </li>
                    )}
                    {!isLoggedIn && (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <div className="navbar-right">
                {isLoggedIn && (
                    <div className="user-info">
                        <span className="logged-in-as">Logged in as: {username}</span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
