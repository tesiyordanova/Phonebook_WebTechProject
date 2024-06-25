import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/shared/layout/AppLayout';
import Home from './components/pages/Home/Home';
import Contacts from './components/pages/Contacts/Contacts';
import Register from './components/pages/Register/Register';
import Login from './components/pages/Login/Login';
import PrivateRoute from './components/shared/PrivateRoute/PrivateRoute';

export const routes = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/contacts',
                element: <PrivateRoute><Contacts /></PrivateRoute>
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    }
]);
