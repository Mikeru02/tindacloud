import React from "react";

import styles from "./styles/Card.module.css";

function Card({ children }) {
    return (
        <div className={styles["card"]}>
            {children}
        </div>
    )
}

export default Card;