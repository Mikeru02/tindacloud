import React from "react";
import Button from "./Button";
import LongLogo from "./LongLogo";
import useNavigation from "../hooks/useNavigation";

function Header() {
    const { goTo } = useNavigation();

    return (
        <header className="w-screen px-2 py-1 flex justify-between">
            <LongLogo></LongLogo>
            <Button
                onClick={() => goTo("/login")}
            >
                Login
            </Button>
        </header>
    );
}

export default Header;