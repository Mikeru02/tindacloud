import React from "react";
import { Link } from "react-router-dom";
import MainLogoImg from "../assets/logo1.png";

function MainLogo() {
    return (
        <Link to="/">
            <img 
                src={MainLogoImg} 
                alt="Main Logo"
                className="w-14 mb-3"
            />
        </Link>
    );
}

export default MainLogo;