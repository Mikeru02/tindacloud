import React from "react";
import FBLogo from "../assets/fb-logo.svg";
import TiktokLogo from "../assets/tiktok-logo.svg";
import IGLogo from "../assets/ig-logo.svg";
import MessageLogo from "../assets/message-logo.svg";
import SocialsLogo from "./SocialsLogo";

function NavLinks() {
    return (
        <div className="flex gap-6 my-5">
            <SocialsLogo
                imgSource={FBLogo}
                urlDestination={""}
            />
            <SocialsLogo
                imgSource={TiktokLogo}
                urlDestination={""}
            />
            <SocialsLogo
                imgSource={IGLogo}
                urlDestination={""}
            />
            <SocialsLogo
                imgSource={MessageLogo}
                urlDestination={""}
            />

        </div>
    );
}

export default NavLinks;