import React from "react";
import Logo1 from "../assets/logo1.png";

function HeaderLoggedIn() {
    return (
        <header className="">
            <img 
                src={Logo1}
                alt="Header Logo"
                className="header-logo"
            />
        </header>
    )
}

export default HeaderLoggedIn;