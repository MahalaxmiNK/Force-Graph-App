import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../src/ui/Button";

describe("Button Component", () => {
  it("renders with provided text", () => {
    render(<Button text="Add Graph" />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Add Graph");
  });

  it("fires onClick event when clicked", () => {
    const mockOnClick = vi.fn();
    render(<Button text="Click Me" onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has the correct type attribute", () => {
    render(<Button text="Submit" type="submit" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("applies custom className", () => {
    render(<Button text="Styled Button" className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("button custom-class");
  });

  it("has aria-label attribute", () => {
    render(<Button text="Submit" ariaLabel="submit-button" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "submit-button");
  });
});
