import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../ui/Loader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized, loading } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  if (!initialized || loading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;