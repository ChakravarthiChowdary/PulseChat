import { render, screen } from "@testing-library/react";
import Home from "../../pages/Home";

describe("Home", () => {
  it("renders the Home component", () => {
    render(<Home />);
    const container = screen.getByTestId("home-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Home");
    expect(container).toHaveClass("border");
    expect(container).toHaveClass("h-screen");
    expect(container).toHaveClass("w-full");
  });
});
