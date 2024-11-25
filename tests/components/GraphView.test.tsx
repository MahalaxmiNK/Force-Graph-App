import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import GraphView from "../../src/components/GraphView";
import { fetchGraphById } from "../../src/services/apiService";
import { graphs } from "../../src/mocks/graphsData";

// Mock API call
vi.mock("../../src/services/apiService", () => ({
  fetchGraphById: vi.fn(),
}));

// Mock components
vi.mock("../../src/components/GraphVisualization", () => ({
  __esModule: true,
  default: () => <div>Mocked GraphVisualization</div>,
}));
vi.mock("../../src/components/NodeOperations", () => ({
  __esModule: true,
  default: () => <div>Mocked NodeOperations</div>,
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe("GraphView Component", () => {
  it("renders loader when graph is null", async () => {
    render(
      <Router>
        <GraphView />
      </Router>
    );

    expect(screen.getByTestId("loader-container")).toBeInTheDocument();
  });

  it("fetches and displays graph data", async () => {
    const mockGraph = graphs[0];
    (fetchGraphById as vi.Mock).mockResolvedValue(mockGraph);

    await act(async () => {
      render(
        <Router>
          <GraphView />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(mockGraph.name)).toBeInTheDocument();
      expect(screen.getByText("Mocked GraphVisualization")).toBeInTheDocument();
      expect(screen.getByText("Mocked NodeOperations")).toBeInTheDocument();
    });
  });

  it("handles API error and navigates to home", async () => {
    (fetchGraphById as vi.Mock).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      render(
        <Router>
          <GraphView />
        </Router>
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Mocked GraphVisualization")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Mocked NodeOperations")
      ).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("navigates back to graph list on back button click", async () => {
    const mockGraph = graphs[0];
    (fetchGraphById as vi.Mock).mockResolvedValue(mockGraph);

    await act(async () => {
      render(
        <Router>
          <GraphView />
        </Router>
      );
    });

    await waitFor(() => screen.getByText(mockGraph.name));

    const backButton = screen.getByText("Back to Graph List");
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
