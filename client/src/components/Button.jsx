import React from "react";

function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className=""
        >
            {children}
        </button>
    );
}

export default Button;