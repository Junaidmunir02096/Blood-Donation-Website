import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


/**
 * PrivateRoute
 * ──────────────────────────────────────────────────────────
 * Protects routes from unauthenticated users. If the user
 * is not logged in, redirects them to the auth page.
 */
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Redirect to the login page
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
