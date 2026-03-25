import React from "react";

function MainOnly({ children }) {
    return (
        <main className="h-screen flex items-center justify-center bg-gray-100">
            {children}
        </main>
    );
}

export default MainOnly;