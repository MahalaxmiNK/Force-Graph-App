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
