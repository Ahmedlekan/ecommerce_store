import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppContext(); // Assuming `user` holds the current user details

  // Check if user is logged in and if they have the admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;