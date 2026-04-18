import React from "react";
import Logo1 from "../assets/logo1.png";
import sytles from "./styles/HeaderLoggedIn.module.css";

function HeaderLoggedIn() {
    return (
        <header className={sytles["header"]}>
            <img 
                src={Logo1}
                alt="Header Logo"
                className="header-logo"
            />
        </header>
    )
}

export default HeaderLoggedIn;