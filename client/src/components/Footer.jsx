import React from "react";
import Logo2 from "../assets/logo2.png";
import NavLinks from "./NavLinks";

function Footer() {
    return (
        <footer className="bg-gray-200 text-black text-center p-2">
            <img 
                src={Logo2}
                alt="Footer Logo"
                className="footer-logo"
            />
            <NavLinks />
            <div>
                <p className="text-sm">© CopyRight TindaCloud.</p>
                <p className="text-sm">{new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex justify-evenly">
                <a className="text-sm">Privacy Policy</a>
                <a className="text-sm">Terms & Conditions</a>
            </div>
        </footer>
    );
}

export default Footer;