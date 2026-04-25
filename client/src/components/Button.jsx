import React from "react";

function Button({ children, onClick, type = "button", variant = "primary", disabled = false, customStyles = "" }) {
    const baseStyle = "px-4 py-2 rounded cursor-pointer font-medium transition";

    const disabledStyles = "opacity-50 cursor-not-allowed";

    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        outline: "",
        danger: "",
        toggle: "bg-transparent",
    };
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseStyle}
                ${variants[variant] || variants.primary}
                ${disabled ? disabledStyles : ""}
                ${customStyles}
            `}
        >
            {children}
        </button>
    );
}

export default Button;