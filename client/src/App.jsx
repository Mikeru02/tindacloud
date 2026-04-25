import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectRoute from "./routes/ProtectRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectRoute />}>
                {/* Implement protected routes here */}
                <Route path="/dashboard" element={<Dashboard />}/>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App;
