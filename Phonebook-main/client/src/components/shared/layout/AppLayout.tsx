import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../nav-bar/NavBar';

const AppLayout: React.FC = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
};

export default AppLayout;