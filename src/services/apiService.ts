// src/services/apiService.ts
import { Graph } from "../models/graphModel";

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
