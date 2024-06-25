import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/features/userSlice';

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const username = useAppSelector(selectUser)?.username;

    if (!username) {
        return <Navigate to="/login" />
    }

    return children;
}

export default PrivateRoute;
