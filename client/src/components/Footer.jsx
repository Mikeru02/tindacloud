import React from "react";
import NavLinks from "./NavLinks";
import LongLogo from "./LongLogo";

function Footer() {
    return (
        <footer className="p-2 mt-8 bg-gray-300">
            <LongLogo></LongLogo>
            <NavLinks />
            <div className="text-center">
                <p className="text-sm">© CopyRight TindaCloud.</p>
                <p className="text-sm">{2026} All rights reserved.</p>
            </div>
            <div className="flex justify-evenly">
                <a className="text-sm">Privacy Policy</a>
                <a className="text-sm">Terms & Conditions</a>
            </div>
        </footer>
    );
}

export default Footer;