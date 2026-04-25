import React from "react";

function MainOnly({ children }) {
    return (
        <main className="">
            {children}
        </main>
    );
}

export default MainOnly;