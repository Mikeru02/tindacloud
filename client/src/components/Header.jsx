import React from "react";
import Logo2 from "../assets/logo2.png";
import Button from "./Button";
import useNavigation from "../hooks/useNavigation";

function Header() {
    const { goTo } = useNavigation();

    return (
        <header className="">
            <img 
                src={Logo2}
                alt="Header Logo"
                className="header-logo"
            />
            <Button
                onClick={() => goTo("/login")}
            >
                Login
            </Button>
        </header>
    );
}

export default Header;