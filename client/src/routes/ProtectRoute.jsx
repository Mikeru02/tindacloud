import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectRoute({ children }) {
    const { isAuthenticated } = useAuth();
    
    const bypassAuth = import.meta.env.VITE_BYPASS_TOKEN === "true";

    if (bypassAuth) {
        return <Outlet />
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;

}

export default ProtectRoute;