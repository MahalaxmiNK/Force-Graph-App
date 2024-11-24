// src/components/Loader.test.tsx

import { render } from "@testing-library/react";
import Loader from "../../src/ui/Loader";

describe("Loader Component", () => {
  it("renders the loader container", () => {
    const { container } = render(<Loader />);

    // Check if the loader container is rendered using className
    const loaderContainer = container.querySelector(".loader-container");
    expect(loaderContainer).toBeInTheDocument();
  });

  it("renders the spinner", () => {
    const { container } = render(<Loader />);

    // Check if the spinner is rendered using className
    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });
});
