import React from "react";
import Logo2 from "../assets/logo2.png";

function Header() {
    const signUpClick = () => {
        alert('Button click');
    }

    return (
        <header className="flex justify-between p-2">
            <img 
                src={Logo2}
                alt="Header Logo"
                className="header-logo"
            />
            <button
                onClick={signUpClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Sign Up
            </button>
        </header>
    );
}

export default Header;