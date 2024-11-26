import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilterInput from "../../../src/components/shared/FilterInput";

describe("FilterInput", () => {
  it("should render with the correct placeholder and value", () => {
    render(
      <FilterInput
        value="initial"
        onChange={vi.fn()}
        placeholder="Search here..."
      />
    );

    const input = screen.getByPlaceholderText(
      "Search here..."
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("initial");
  });

  it("should call onChange when the value changes", () => {
    const handleChange = vi.fn();
    render(<FilterInput value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("new value");
  });
});
