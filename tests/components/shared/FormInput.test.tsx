import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FormInput from "../../../src/components/shared/FormInput";

describe("FormInput", () => {
  it("should render input, button, and optional error message", () => {
    render(
      <FormInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={vi.fn()}
        errorMessage="Test error"
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();

    const errorMessage = screen.getByText("Test error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("error-message");
  });

  it("should call onChange handler when input value changes", () => {
    const handleChange = vi.fn();
    render(
      <FormInput
        value=""
        onChange={handleChange}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("new value");
  });

  it("should call onSubmit handler when the form is submitted", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <FormInput
        value="test value"
        onChange={vi.fn()}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={handleSubmit}
      />
    );

    const form = screen.getByTestId("form");
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show an error message if provided", () => {
    render(
      <FormInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={vi.fn()}
        errorMessage="Input is required"
      />
    );

    const errorMessage = screen.getByText("Input is required");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("error-message");
  });

  it("should apply error styles to the input when there is an error", () => {
    render(
      <FormInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={vi.fn()}
        errorMessage="Invalid input"
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("input-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "error-message");
  });

  it("should not display an error message or apply error styles if no error", () => {
    render(
      <FormInput
        value=""
        onChange={vi.fn()}
        placeholder="Enter text"
        buttonText="Submit"
        onSubmit={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).not.toHaveClass("input-error");
    expect(input).toHaveAttribute("aria-invalid", "false"); // Updated expectation
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
