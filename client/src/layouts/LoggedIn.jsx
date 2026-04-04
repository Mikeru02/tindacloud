import React from "react";

function LoggedIn({ header, navigation, children }) {
    return (
        <>
            {header}
            <main>{children}</main>
            {navigation}
        </>
    )
}

export default LoggedIn;