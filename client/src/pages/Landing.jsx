import React from "react";
import DefaultLayout from "../layouts/Default";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionCard from "../components/SectionCard";
import Card from "../components/Card";
import Button from "../components/Button";

import Management from "../assets/svg/management.svg";
import Cart from "../assets/svg/cart.svg";
import Sales from "../assets/svg/sales.svg";
import Package from "../assets/svg/package.svg";

import useNavigation from "../hooks/useNavigation";

function Landing() {
    const { goTo } = useNavigation();

    return (
        <DefaultLayout
            headerContent={<Header />}
            footerContent={<Footer />}
        >
            <SectionCard 
                customStyles="h-64 flex flex-col justify-center gap-2 text-center"
            >
                <h1 className="text-3xl">Manage Your Store Anytime Anywhere</h1>
                <p>TindaCloud helps you manage products, orders, and inventory easily using your any devices.</p>
                <div className="space-x-4">
                    <Button
                        onClick={() => goTo("/signup")}
                    >
                        Get Started
                    </Button>
                    <Button variant="secondary">Learn More</Button>
                </div>
            </SectionCard>

            <SectionCard 
                customStyles="w-100 flex flex-wrap justify-center gap-4"
            >
                <Card 
                    customStyles="w-48 p-8 border border-black rounded-lg text-center"    
                >
                    <img 
                        src={Management} 
                        alt="Product Management Illustration" 
                        className="w-40 h-20"
                    />
                    <h3 className="font-bold">Product Management</h3>
                    <p>Easily add, edit, and organize your products.</p>
                </Card>
                <Card 
                    customStyles="w-48 p-8 border border-black rounded-lg align-center"
                >
                    <img 
                        src={Cart} 
                        alt="Order Tracking Illustration" 
                        className="w-40 h-20"
                    />
                    <h3 className="font-bold">Order Tracking</h3>
                    <p>Track orders in real-time and manage deliveries.</p>
                </Card>
                <Card customStyles="w-48 p-8 border border-black rounded-lg text-center">
                    <img 
                        src={Sales} 
                        alt="Sales Dashboard Illustration" 
                        className="w-40 h-20"
                    />
                    <h3 className="font-bold">Sales Dashboard</h3>
                    <p>Monitor your sales and performance instantly.</p>
                </Card>
                <Card customStyles="w-48 p-8 border border-black rounded-lg text-center">
                    <img 
                        src={Package} 
                        alt="Fast Illustration" 
                        className="w-40 h-20"
                    />
                    <h3 className="font-bold">Fast & Mobile Ready</h3>
                    <p>Optimized for low bandwidth and mobile devices.</p>
                </Card>
            </SectionCard>

            <SectionCard
                customStyles="h-32 flex flex-col justify-center gap-2 text-center"
            >
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