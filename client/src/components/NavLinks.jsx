import React from "react";
import FBLogo from "../assets/fb-logo.svg";
import TiktokLogo from "../assets/tiktok-logo.svg";
import IGLogo from "../assets/ig-logo.svg";
import MessageLogo from "../assets/message-logo.svg";

function NavLinks() {
    return (
        <div className="flex gap-6 mt-5">
            <a>
                <img src={FBLogo} className="nav-links-img" />
            </a>
            <a>
                <img src={TiktokLogo} className="nav-links-img" />
            </a>
            <a>
                <img src={IGLogo} className="nav-links-img" />
            </a>
            <a>
                <img src={MessageLogo} className="nav-links-img" />
            </a>
        </div>
    );
}

export default NavLinks;