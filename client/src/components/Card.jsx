import React from "react";

function Card({ children, customStyles = "" }) {
    return (
        <div className={`${customStyles}`}>
            {children}
        </div>
    )
}

export default Card;