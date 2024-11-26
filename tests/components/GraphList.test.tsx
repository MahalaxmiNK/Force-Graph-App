import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import GraphList from "../../src/components/GraphList";
import {
  fetchGraphs,
  createGraph,
  deleteGraph,
} from "../../src/services/apiService";
import { graphs } from "../../src/mocks/graphsData";

// Mock API calls
vi.mock("../../src/services/apiService", () => ({
  fetchGraphs: vi.fn(),
  createGraph: vi.fn(),
  deleteGraph: vi.fn(),
}));

// Mock FilterInput and FormInput components
vi.mock("../../src/components/shared/FilterInput", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <input
      data-testid="filter-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("../../src/components/shared/FormInput", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    onSubmit,
    buttonText,
    placeholder,
    errorMessage,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    buttonText: string;
    errorMessage: string;
    onSubmit: () => void;
  }) => (
    <form onSubmit={onSubmit}>
      <input
        data-testid="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {errorMessage && <span>{errorMessage}</span>}
      <button type="submit">{buttonText}</button>
    </form>
  ),
}));

describe("GraphList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders graph list and fetches graphs on load", async () => {
    (fetchGraphs as vi.Mock).mockResolvedValue(graphs);

    await act(async () => {
      render(
        <Router>
          <GraphList />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Graphs")).toBeInTheDocument();
      expect(screen.getAllByRole("article")).toHaveLength(graphs.length);
    });
  });

  it("creates a new graph successfully", async () => {
    (fetchGraphs as vi.Mock).mockResolvedValue(graphs);
    (createGraph as vi.Mock).mockResolvedValue({
      id: "grph_4",
      name: "Graph 4",
      data: { nodes: [], edges: [] },
    });

    await act(async () => {
      render(
        <Router>
          <GraphList />
        </Router>
      );
    });

    fireEvent.change(screen.getByTestId("form-input"), {
      target: { value: "Graph 4" },
    });
    fireEvent.click(screen.getByText("Add Graph"));

    await waitFor(() => {
      expect(createGraph).toHaveBeenCalledWith({
        id: "",
        name: "Graph 4",
        data: { nodes: [], edges: [] },
      });
      expect(fetchGraphs).toHaveBeenCalledTimes(2); // Once on load and once after creating a graph
    });
  });

  it("shows an error when trying to create a graph with an empty name", async () => {
    render(
      <Router>
        <GraphList />
      </Router>
    );

    fireEvent.click(screen.getByText("Add Graph"));

    await waitFor(() => {
      expect(
        screen.getByText("Graph name cannot be empty!")
      ).toBeInTheDocument();
    });
  });

  it("deletes a graph successfully", async () => {
    (fetchGraphs as vi.Mock).mockResolvedValue(graphs);
    (deleteGraph as vi.Mock).mockResolvedValue(true);

    await act(async () => {
      render(
        <Router>
          <GraphList />
        </Router>
      );
    });

    fireEvent.click(screen.getByLabelText(`Delete graph ${graphs[0].name}`));

    await waitFor(() => {
      expect(deleteGraph).toHaveBeenCalledWith(graphs[0].id);
      expect(fetchGraphs).toHaveBeenCalledTimes(2); // Once on load and once after deleting a graph
    });
  });
});
