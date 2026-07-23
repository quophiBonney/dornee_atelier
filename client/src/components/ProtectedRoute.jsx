import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
