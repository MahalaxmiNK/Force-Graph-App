import { render } from "@testing-library/react";
import Loader from "../../src/ui/Loader";

describe("Loader Component", () => {
  it("renders the loader container", () => {
    const { container } = render(<Loader />);

    const loaderContainer = container.querySelector(".loader-container");
    expect(loaderContainer).toBeInTheDocument();
  });

  it("renders the spinner", () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector(".spinner");
    expect(spinner).toBeInTheDocument();
  });
});
