import { Navigate, useLocation } from "react-router-dom";

// Decode JWT payload without verifying signature (client-side only checks expiry)
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // If we can't decode, treat as expired
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    // Clear stale tokens
    if (token) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
