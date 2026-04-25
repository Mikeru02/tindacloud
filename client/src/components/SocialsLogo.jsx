import React from "react";

function SocialsLogo({ imgSource, urlDestination }) {
    return (
        <a
            href={urlDestination}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
        >
            <img 
                src={imgSource}
                alt="Socials Icon"
                className="w-6"
            />

        </a>
    )
}

export default SocialsLogo;