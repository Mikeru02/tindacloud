import React from "react";
import DefaultLayout from "../layouts/default";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Landing() {
    return (
        <DefaultLayout
            headerContent={<Header />}
            footerContent={<Footer />}
        >
            <h1>landing Page</h1>
        </DefaultLayout>
    );
}

export default Landing;