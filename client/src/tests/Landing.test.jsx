import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Landing from "../pages/Landing";

describe("Landing Page", () => {
    test("renders all fields in landing page", () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        )

        // Check if logo in header is rendered
        const headerLogo = screen.getByAltText(/Header Logo/i);
        expect(headerLogo).toBeInTheDocument();
        
        // Check if the logo in footer is rendered
        const footerLogo = screen.getByAltText(/Footer Logo/i);
        expect(footerLogo).toBeInTheDocument();
    });
})