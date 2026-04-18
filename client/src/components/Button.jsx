import React from "react";
import styles from "./styles/Button.module.css";

function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles["btn"]} ${styles[`btn-${variant}`]}`}
        >
            {children}
        </button>
    );
}

export default Button;