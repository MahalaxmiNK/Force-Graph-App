import { http, HttpResponse } from "msw";
import { Graph, Node } from "../models/graphModel";
import { graphs } from "./graphsData";

// Initialize the Map with predefined data
const allGraphs = new Map<string, Graph>(
  graphs.map((graph) => [graph.id, graph])
);

export const handlers = [
  //Fetch all graphs
  http.get("/api/graphs", () => {
    const graphs = Array.from(allGraphs.values());
    console.log(graphs);
    return HttpResponse.json(graphs);
  }),

  // Fetch a graph by ID
  http.get<{ id: string }>("/api/graphs/:id", ({ params }) => {
    const { id } = params;
    const graph = allGraphs.get(id);

    if (!graph) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(graph);
  }),

  // Create graph
  http.post("/api/graphs", async ({ request }) => {
    const newGraph = (await request.json()) as Graph;
    // Setting the id
    const highestId = Array.from(allGraphs.keys())
      .map((id) => parseInt(id.replace("grph_", ""), 10))
      .reduce((max, current) => (current > max ? current : max), 0);
    const newId = `grph_${highestId + 1}`;

    const graphToCreate: Graph = {
      id: newId,
      name: newGraph.name,
      data: newGraph.data,
    };
    // Save the new graph to the map
    allGraphs.set(newId, graphToCreate);
    return HttpResponse.json(graphToCreate, { status: 201 });
  }),

  //update graph
  http.put<{ id: string }>("/api/graphs/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedGraph = (await request.json()) as Graph;
    // Ensure the graph exists
    if (!allGraphs.has(id)) {
      return new HttpResponse(null, { status: 404 });
    }
    // Validate the updated data
    if (!updatedGraph.name || updatedGraph.name.trim() === "") {
      return new HttpResponse(null, {
        status: 400,
        statusText: "Graph name is required",
      });
    }
    allGraphs.set(id, { ...updatedGraph, id }); // Merge updates
    return HttpResponse.json(allGraphs.get(id));
  }),

  //Delete a graph by ID
  http.delete<{ id: string }>("/api/graphs/:id", ({ params }) => {
    const { id } = params;
    const graph = allGraphs.get(id);
    // Return 404 if the graph doesn't exist
    if (!graph) {
      return new HttpResponse(null, { status: 404 });
    }
    // Remove the graph
    allGraphs.delete(id);
    return HttpResponse.json(graph);
  }),

  //create new node
  http.post<{ id: string }>(
    "/api/graphs/:id/nodes",
    async ({ params, request }) => {
      const { id } = params;
      const graph = allGraphs.get(id);

      if (!graph) {
        return new HttpResponse(null, { status: 404 });
      }

      const newNode = (await request.json()) as Node;

      if (!newNode.label || newNode.label.trim() === "") {
        return new HttpResponse(null, {
          status: 400,
          statusText: "Node label is required",
        });
      }

      // Check for duplicate labels
      const isDuplicate = graph.data.nodes.some(
        (node) => node.label.toLowerCase() === newNode.label.toLowerCase()
      );
      if (isDuplicate) {
        return new HttpResponse(null, {
          status: 400,
          statusText: "A node with this label already exists",
        });
      }

      // Generate a new unique node ID
      const highestNodeId = graph.data.nodes
        .map((node) => parseInt(node.id.replace("nd_", ""), 10))
        .reduce((max, current) => (current > max ? current : max), 0);

      const newId = `nd_${highestNodeId + 1}`;
      const nodeToCreate: Node = { id: newId, label: newNode.label };

      // Add the node to the graph
      graph.data.nodes.push(nodeToCreate);

      return HttpResponse.json(nodeToCreate, { status: 201 });
    }
  ),

  // Update a node in a graph
  http.put<{ graphId: string; nodeId: string }>(
    "/api/graphs/:graphId/nodes/:nodeId",
    async ({ params, request }) => {
      const { graphId, nodeId } = params;
      const graph = allGraphs.get(graphId);
      if (!graph) {
        return new HttpResponse(null, { status: 404 });
      }

      const updatedNode = (await request.json()) as Node;
      if (!updatedNode.label || updatedNode.label.trim() === "") {
        return new HttpResponse(null, {
          status: 400,
          statusText: "Node label is required",
        });
      }

      // Update the node in the graph
      const nodeIndex = graph.data.nodes.findIndex(
        (node) => node.id === nodeId
      );
      if (nodeIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      graph.data.nodes[nodeIndex] = {
        ...graph.data.nodes[nodeIndex],
        label: updatedNode.label,
      };
      return HttpResponse.json(graph.data.nodes[nodeIndex]);
    }
  ),

  // Delete a node from a graph
  http.delete<{ graphId: string; nodeId: string }>(
    "/api/graphs/:graphId/nodes/:nodeId",
    ({ params }) => {
      const { graphId, nodeId } = params;
      const graph = allGraphs.get(graphId);
      if (!graph) {
        return new HttpResponse(null, { status: 404 });
      }

      const nodeIndex = graph.data.nodes.findIndex(
        (node) => node.id === nodeId
      );
      if (nodeIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const deletedNode = graph.data.nodes.splice(nodeIndex, 1)[0];
      return HttpResponse.json(deletedNode);
    }
  ),
];
