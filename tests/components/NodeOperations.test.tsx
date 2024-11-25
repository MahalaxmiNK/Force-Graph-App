import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as apiService from "../../src/services/apiService";
import { Node, Graph } from "../../src/models/graphModel";

describe("API Service Tests", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetchGraphs should return a list of graphs", async () => {
    const mockGraph: Graph = {
      id: "graph1",
      name: "Test Graph",
      data: { nodes: [{ id: "nd_1", label: "Node 1" }], edges: [] },
    };

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraph,
    });

    const graphs = await apiService.fetchGraphs();
    expect(graphs).toEqual(mockGraph);
    expect(fetch).toHaveBeenCalledWith("/api/graphs");
  });

  it("fetchGraphById should return a specific graph by ID", async () => {
    const mockGraph: Graph = {
      id: "graph1",
      name: "Test Graph",
      data: { nodes: [{ id: "nd_1", label: "Node 1" }], edges: [] },
    };
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraph,
    });

    const graph = await apiService.fetchGraphById("1");
    expect(graph).toEqual(mockGraph);
    expect(fetch).toHaveBeenCalledWith("/api/graphs/1");
  });

  it("createGraph should create a new graph", async () => {
    const newGraph: Graph = {
      id: "graph2",
      name: "Test Graph",
      data: { nodes: [{ id: "nd_1", label: "Node 1" }], edges: [] },
    };
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await apiService.createGraph(newGraph);
    expect(fetch).toHaveBeenCalledWith(
      "/api/graphs",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newGraph),
      })
    );
  });

  it("createNode should create a new node in a graph", async () => {
    const newNode: Node = { id: "nd_1", label: "Node 1" };
    const mockNodeResponse: Node = { id: "nd_1", label: "Node 1" };

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNodeResponse,
    });

    const node = await apiService.createNode("graph1", newNode);
    expect(node).toEqual(mockNodeResponse);
    expect(fetch).toHaveBeenCalledWith(
      "/api/graphs/graph1/nodes",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newNode),
      })
    );
  });

  it("updateNode should update an existing node in a graph", async () => {
    const updatedNode: Node = { id: "nd_1", label: "Updated Node" };

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await apiService.updateNode("graph1", "1", updatedNode);
    expect(fetch).toHaveBeenCalledWith(
      "/api/graphs/graph1/nodes/1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(updatedNode),
      })
    );
  });

  it("deleteNode should delete a node from a graph", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await apiService.deleteNode("graph1", "1");
    expect(fetch).toHaveBeenCalledWith(
      "/api/graphs/graph1/nodes/1",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });

  it("deleteGraph should delete a graph", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await apiService.deleteGraph("1");
    expect(fetch).toHaveBeenCalledWith(
      "/api/graphs/1",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });
});
