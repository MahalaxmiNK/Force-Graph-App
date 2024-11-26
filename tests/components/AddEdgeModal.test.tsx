import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEdgeModal from "../../src/components/AddEdgeModal";
import { graphs } from "../../src/mocks/graphsData";
import { Graph } from "../../src/models/graphModel";

vi.mock("../services/apiService", () => ({
  createEdge: vi.fn().mockResolvedValue({ source: "nd_2", target: "nd_3" }),
}));

const graph: Graph = {
  id: "grph_2",
  name: "Graph 2",
  data: {
    nodes: [
      { id: "nd_1", label: "Node 1" },
      { id: "nd_2", label: "Node 2" },
    ],
    edges: [{ source: "nd_1", target: "nd_2" }],
  },
};

describe("AddEdgeModal", () => {
  const mockSetGraph = vi.fn();
  const mockOnClose = vi.fn();

  const setup = (isOpen: boolean, graphIndex: number) => {
    render(
      <AddEdgeModal
        isOpen={isOpen}
        onClose={mockOnClose}
        graph={graphs[graphIndex]}
        setGraph={mockSetGraph}
      />
    );
  };

  it("renders correctly when open", () => {
    setup(true, 0); // Use the first graph from the dataset

    expect(
      screen.getByRole("button", { name: /Add Edge/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Source Node/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Node/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    setup(false, 0);
    expect(screen.queryByText(/Add Edge/i)).not.toBeInTheDocument();
  });

  it("displays error if source or target node is not selected", async () => {
    setup(true, 0);

    const addButton = screen.getByRole("button", { name: /Add Edge/i });
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(
        screen.getByText(/Please select both source and target nodes/i)
      ).toBeInTheDocument()
    );
  });

  test("resets state and calls onClose when modal is closed", async () => {
    const onCloseMock = vi.fn();

    render(
      <AddEdgeModal
        isOpen={true}
        onClose={onCloseMock}
        graph={graph}
        setGraph={vi.fn()}
      />
    );

    // Click the close button
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    // Assert that the onClose function is called
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("filters out the selected source node from the target node options", () => {
    setup(true, 0);

    fireEvent.change(screen.getByLabelText(/Source Node/i), {
      target: { value: "nd_1" },
    });

    const targetNodeOptions = screen
      .getByLabelText(/Target Node/i)
      .querySelectorAll("option");
    expect(
      Array.from(targetNodeOptions).map((option) => option.value)
    ).not.toContain("nd_1");
  });
});
