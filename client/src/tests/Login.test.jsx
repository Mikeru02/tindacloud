import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom"; // needed for page routing
import Login from "../pages/Login"; // adjust path if needed

describe("Login Page", () => {
  test("renders all fields and login button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Heading
    const heading = screen.getByRole("heading", { name: /TindaCloud Login/i });
    expect(heading).toBeInTheDocument();

    // Username input
    const usernameInput = screen.getByPlaceholderText(/username/i);
    expect(usernameInput).toBeInTheDocument();

    // Password input
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    // Login button
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("allows typing in username and password", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await userEvent.type(usernameInput, "myuser");
    await userEvent.type(passwordInput, "mypassword");

    expect(usernameInput).toHaveValue("myuser");
    expect(passwordInput).toHaveValue("mypassword");
  });
});