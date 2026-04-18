import React from "react";
import DefaultLayout from "../layouts/Default";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionCard from "../components/SectionCard";
import Card from "../components/Card";
import Button from "../components/Button";

import useNavigation from "../hooks/useNavigation";

function Landing() {
    const { goTo } = useNavigation();

    return (
        <DefaultLayout
            headerContent={<Header />}
            footerContent={<Footer />}
        >
            <SectionCard>
                <h1>Manage Your Store Anytime Anywhere</h1>
                <p>TindaCloud helps you manage products, orders, and inventory easily using your any devices.</p>
                <div className="action-buttons">
                    <Button
                        onClick={() => goTo("/signup")}
                    >
                        Get Started
                    </Button>
                    <Button variant="secondary">Learn More</Button>
                </div>
            </SectionCard>

            <SectionCard>
                <Card>
                    <h3>📦 Product Management</h3>
                    <p>Easily add, edit, and organize your products.</p>
                </Card>
                <Card>
                    <h3>🛒 Order Tracking</h3>
                    <p>Track orders in real-time and manage deliveries.</p>
                </Card>
                <Card>
                    <h3>📊 Sales Dashboard</h3>
                    <p>Monitor your sales and performance instantly.</p>
                </Card>
                <Card>
                    <h3>⚡ Fast & Mobile Ready</h3>
                    <p>Optimized for low bandwidth and mobile devices.</p>
                </Card>
            </SectionCard>

            <SectionCard>
                <h2>Start your digital store today!</h2>
                <Button
                    onClick={() => goTo("/signup")}
                >
                    Create Account
                </Button>
            </SectionCard>
        </DefaultLayout>
    );
}

export default Landing;