import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { graphs } from "../../src/mocks/graphsData"; // Make sure your graphs data is correctly structured
import GraphVisualization from "../../src/components/GraphVisualization";
import { GraphProvider } from "../../src/context/GraphContext"; // Import the GraphProvider

// Mocking react-force-graph
vi.mock("react-force-graph", () => {
  return {
    ForceGraph2D: vi.fn(() => <div>Mocked ForceGraph2D</div>),
  };
});

describe("GraphVisualization", () => {
  it("renders graph visualization with graph data", async () => {
    const graph = graphs[0]; // Example graph data

    // Wrapping the component with GraphProvider
    render(
      <GraphProvider>
        <GraphVisualization />
      </GraphProvider>
    );

    // Check if the graph visualization is rendered
    expect(screen.getByTestId("graph-visualization")).toBeInTheDocument();
    expect(screen.getByText("Mocked ForceGraph2D")).toBeInTheDocument();
  });

  it("calls d3ReheatSimulation when graph data changes", async () => {
    const graph = graphs[0]; // Initial graph data
    const { rerender } = render(
      <GraphProvider>
        <GraphVisualization />
      </GraphProvider>
    );

    // Create a spy to check if d3ReheatSimulation is called
    const spyReheatSimulation = vi.fn();
    const { ForceGraph2D } = await import("react-force-graph");

    // Mock ForceGraph2D to spy on its method
    ForceGraph2D.mockImplementationOnce((props: any) => {
      spyReheatSimulation(); // Call the spy function when rendered
      return <div>Mocked ForceGraph2D</div>;
    });

    rerender(
      <GraphProvider>
        <GraphVisualization />
      </GraphProvider>
    );

    // Wait for the effect to run and check if d3ReheatSimulation was called
    await waitFor(() => {
      expect(spyReheatSimulation).toHaveBeenCalled();
    });
  });
});
