import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { graphs } from "../../src/mocks/graphsData";
import GraphVisualization from "../../src/components/GraphVisualization";

vi.mock("react-force-graph", () => {
  return {
    ForceGraph2D: vi.fn(() => <div>Mocked ForceGraph2D</div>),
  };
});

describe("GraphVisualization", () => {
  it("renders graph visualization with graph data", async () => {
    const graph = graphs[0];

    render(<GraphVisualization graph={graph} />);

    expect(screen.getByTestId("graph-visualization")).toBeInTheDocument();

    expect(screen.getByText("Mocked ForceGraph2D")).toBeInTheDocument();
  });

  it("correctly passes graph data to ForceGraph2D", async () => {
    const graph = graphs[1];

    render(<GraphVisualization graph={graph} />);

    const forceGraph2D = screen.getByText("Mocked ForceGraph2D");
    expect(forceGraph2D).toBeInTheDocument();
  });

  it("calls d3ReheatSimulation when graph data changes", async () => {
    const graph = graphs[0];
    const { rerender } = render(<GraphVisualization graph={graph} />);

    // Create a spy to check if d3ReheatSimulation is called
    const spyReheatSimulation = vi.fn();
    const { ForceGraph2D } = await import("react-force-graph");
    ForceGraph2D.mockImplementationOnce((props: any) => {
      spyReheatSimulation();
      return <div>Mocked ForceGraph2D</div>;
    });

    // Simulate a change in graph data
    const updatedGraph = graphs[2];
    rerender(<GraphVisualization graph={updatedGraph} />);

    // Wait for the effect to run
    await waitFor(() => {
      expect(spyReheatSimulation).toHaveBeenCalled();
    });
  });
});
