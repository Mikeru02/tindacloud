import React from "react";

function SectionCard({ children, customStyles = "" }) {
    return (
        <section className={`${customStyles}`}>
            {children}
        </section>
    );
}

export default SectionCard;