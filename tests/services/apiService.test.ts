import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchGraphs,
  fetchGraphById,
  createGraph,
  deleteGraph,
  createNode,
  updateNode,
  deleteNode,
} from "../../src/services/apiService";
import { Graph, Node } from "../../src/models/graphModel";
import { graphs } from "../../src/mocks/graphsData";

describe("apiService with mock data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchGraphs should return all graphs", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => graphs,
    });

    const result = await fetchGraphs();
    expect(result).toEqual(graphs);
    expect(fetch).toHaveBeenCalledWith("/api/graphs");
  });

  it("fetchGraphById should return a specific graph by ID", async () => {
    const graphId = "grph_2";
    const mockGraph = graphs.find((g) => g.id === graphId);

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockGraph,
    });

    const result = await fetchGraphById(graphId);
    expect(result).toEqual(mockGraph);
    expect(fetch).toHaveBeenCalledWith(`/api/graphs/${graphId}`);
  });

  it("createGraph should send a POST request and create a graph", async () => {
    const newGraph: Graph = {
      id: "grph_4",
      name: "Graph 4",
      data: { nodes: [], edges: [] },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    await createGraph(newGraph);
    expect(fetch).toHaveBeenCalledWith("/api/graphs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGraph),
    });
  });

  it("deleteGraph should send a DELETE request", async () => {
    const graphId = "grph_1";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    await deleteGraph(graphId);
    expect(fetch).toHaveBeenCalledWith(`/api/graphs/${graphId}`, {
      method: "DELETE",
    });
  });

  it("createNode should send a POST request and return the created node", async () => {
    const newNode: Node = { id: "", label: "New Node" };
    const createdNode: Node = { id: "nd_new", label: "New Node" };
    const graphId = "grph_1";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => createdNode,
    });

    const result = await createNode(graphId, newNode);
    expect(result).toEqual(createdNode);
    expect(fetch).toHaveBeenCalledWith(`/api/graphs/${graphId}/nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNode),
    });
  });

  it("updateNode should send a PUT request", async () => {
    const updatedNode: Node = { id: "nd_1", label: "Updated Node" };
    const graphId = "grph_1";
    const nodeId = "nd_1";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    await updateNode(graphId, nodeId, updatedNode);
    expect(fetch).toHaveBeenCalledWith(
      `/api/graphs/${graphId}/nodes/${nodeId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNode),
      }
    );
  });

  it("deleteNode should send a DELETE request", async () => {
    const graphId = "grph_1";
    const nodeId = "nd_4";

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    await deleteNode(graphId, nodeId);
    expect(fetch).toHaveBeenCalledWith(
      `/api/graphs/${graphId}/nodes/${nodeId}`,
      {
        method: "DELETE",
      }
    );
  });
});
