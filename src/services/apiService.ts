import { Graph, Node } from "../models/graphModel";

// Fetch all graphs
export const fetchGraphs = async (): Promise<Graph[]> => {
  const response = await fetch("/api/graphs");
  if (!response.ok) throw new Error("Failed to fetch graphs");
  return await response.json();
};

// Fetch a specific graph by ID
export const fetchGraphById = async (id: string): Promise<Graph> => {
  const response = await fetch(`/api/graphs/${id}`);
  if (!response.ok) throw new Error("Failed to fetch the graph");
  return await response.json();
};

// Create a new graph
export const createGraph = async (graph: Graph): Promise<void> => {
  const response = await fetch("/api/graphs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(graph),
  });
  if (!response.ok) throw new Error("Failed to create graph");
};

// Delete a graph by ID
export const deleteGraph = async (id: string): Promise<void> => {
  const response = await fetch(`/api/graphs/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete graph");
};

//update the graph
export const updateGraphApi = async (
  id: string,
  updatedGraph: Graph
): Promise<Graph> => {
  const response = await fetch(`/api/graphs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedGraph),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update graph: ${errorText}`);
  }

  return response.json(); // assuming the response body contains the updated graph
};

//Create new node
export const createNode = async (
  graphId: string,
  node: Node
): Promise<Node> => {
  const response = await fetch(`/api/graphs/${graphId}/nodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(node),
  });

  if (!response.ok) {
    throw new Error("Failed to create node");
  }

  return await response.json();
};

// Update a node in a graph
export const updateNode = async (
  graphId: string,
  nodeId: string,
  updatedNode: Node
): Promise<void> => {
  const response = await fetch(`/api/graphs/${graphId}/nodes/${nodeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedNode),
  });
  if (!response.ok) throw new Error("Failed to update node");
};

// Delete a node from a graph
export const deleteNode = async (
  graphId: string,
  nodeId: string
): Promise<void> => {
  const response = await fetch(`/api/graphs/${graphId}/nodes/${nodeId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete node");
};

// Create a new edge in a graph
export const createEdge = async (
  graphId: string,
  edge: { source: string; target: string }
): Promise<{ source: string; target: string }> => {
  const response = await fetch(`/api/graphs/${graphId}/edges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(edge),
  });

  if (!response.ok) {
    throw new Error("Failed to create edge");
  }

  return await response.json();
};

// Delete an edge from a graph
export const deleteEdge = async (
  graphId: string,
  source: string,
  target: string
): Promise<{ source: string; target: string }> => {
  const response = await fetch(
    `/api/graphs/${graphId}/edges?source=${source}&target=${target}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete edge");
  }

  return await response.json();
};
