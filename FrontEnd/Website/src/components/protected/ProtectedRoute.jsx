import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  // Replace with your actual authentication check
  const isAuthenticated = true; // Check if user is logged in
  const userIsAdmin = true; // Check if user has admin role

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
