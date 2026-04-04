import React from "react";
import LoggedIn from "../layouts/LoggedIn";
import HeaderLoggedIn from "../components/HeaderLoggedIn";
import NavigationLoggedIn from "../components/NavigationLoggedIn";

function Dashboard() {
    return (
        <LoggedIn
            header={<HeaderLoggedIn />}
            navigation={<NavigationLoggedIn />}
        >
        </LoggedIn>
    )
}

export default Dashboard;