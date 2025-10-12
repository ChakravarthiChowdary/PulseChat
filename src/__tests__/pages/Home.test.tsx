import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/Home";

describe("HomePage", () => {
  it("renders the outer container with correct test id", () => {
    render(<HomePage />);
    const outerContainer = screen.getByTestId("home-page-container");
    expect(outerContainer).toBeInTheDocument();
    expect(outerContainer).toHaveClass(
      "border w-full h-screen sm:px-[15%] sm:py-[5%]",
    );
  });

  it("renders the inner container with correct test id", () => {
    render(<HomePage />);
    const innerContainer = screen.getByTestId("home-page-inner-container");
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer).toHaveClass(
      "backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative",
    );
  });
});
