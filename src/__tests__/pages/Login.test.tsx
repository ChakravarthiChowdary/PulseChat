/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock axios config before any imports
jest.mock("../../config/axios.config", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../pages/Login";
import { AuthContext } from "../../context/AuthContext";

interface FormProps {
  currState: "Log in" | "Sign up";
  isDataSubmitted: boolean;
  onSubmit: () => void;
  onToggleState: () => void;
}

// Mock Form component
jest.mock("../../components/features/login/Form", () => ({
  Form: ({
    currState,
    isDataSubmitted,
    onSubmit,
    onToggleState,
  }: FormProps) => {
    const React = require("react");
    const { useContext } = React;
    const { AuthContext } = require("../../context/AuthContext");
    const context = useContext(AuthContext);

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currState === "Log in") {
        // Call login when in Log in mode
        context?.login?.("login", {});
      } else if (currState === "Sign up" && isDataSubmitted) {
        context?.login?.("register", {});
      }
      onSubmit();
    };
    return (
      <form data-testid="login-form" onSubmit={handleFormSubmit}>
        <button type="button" onClick={onToggleState}>
          Toggle
        </button>
        <button type="submit">Submit</button>
        <span>{currState}</span>
        {isDataSubmitted && <span>Submitted</span>}
      </form>
    );
  },
}));

const mockLogin = jest.fn();

const renderWithAuthContext = (ui: React.ReactElement) =>
  render(
    <AuthContext.Provider value={{ login: mockLogin } as any}>
      {ui}
    </AuthContext.Provider>,
  );

describe("Login Page", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it("renders the form", () => {
    renderWithAuthContext(<Login />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("toggles between Sign up and Log in", () => {
    renderWithAuthContext(<Login />);
    const toggleBtn = screen.getByText("Toggle");
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Log in")).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("shows submitted state on Sign up submit", async () => {
    renderWithAuthContext(<Login />);
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
    expect(await screen.findByText("Submitted")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls login on Log in submit", () => {
    renderWithAuthContext(<Login />);
    const toggleBtn = screen.getByText("Toggle");
    fireEvent.click(toggleBtn);
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
    expect(mockLogin).toHaveBeenCalledWith("login", expect.any(Object));
  });

  it("calls login on second Sign up submit", () => {
    renderWithAuthContext(<Login />);
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    expect(mockLogin).toHaveBeenCalledWith("register", expect.any(Object));
  });
});
