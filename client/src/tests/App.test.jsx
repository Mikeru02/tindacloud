import React from "react"; // needed for Jest + babel-jest
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import userEvent from "@testing-library/user-event";

describe("App routing", () => {
  test("renders Landing page at root path '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Expect something in Landing page
    //const landingHeading = screen.getByText(/Welcome/i); // adjust based on your Landing page
    //expect(landingHeading).toBeInTheDocument();
  });

  test("renders Login page at path '/login'", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    // Check Login page heading
    const loginHeading = screen.getByRole("heading", { name: /TindaCloud Login/i });
    expect(loginHeading).toBeInTheDocument();

    // Check input fields
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    // Check login button
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("navigates between routes", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Landing page should be visible
    //expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

    // Simulate navigation by rendering App at /login
    render(/
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /TindaCloud Login/i })).toBeInTheDocument();
  });

  test("renders Not Found page for unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    )/

    expect(screen.getByText(/404 - Page Not Found/i) 
  }
});
