import React from "react";
import styles from "./styles/mainOnly.module.css";

function MainOnly({ children }) {
    return (
        <main className={styles["main"]}>
            {children}
        </main>
    );
}

export default MainOnly;