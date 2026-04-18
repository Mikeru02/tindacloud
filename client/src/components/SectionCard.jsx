import React from "react";

import styles from "./styles/SectionCard.module.css";

function SectionCard({ children }) {
    return (
        <section className={styles["section-card"]}>
            {children}
        </section>
    );
}

export default SectionCard;