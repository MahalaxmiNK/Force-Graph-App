import { Graph, Node } from "../models/graphModel";

export const addNodeToGraph = (graph: Graph, newNode: Node): Graph => ({
  ...graph,
  data: { ...graph.data, nodes: [...graph.data.nodes, newNode] },
});

export const updateNodeInGraph = (graph: Graph, updatedNode: Node): Graph => ({
  ...graph,
  data: {
    ...graph.data,
    nodes: graph.data.nodes.map((node) =>
      node.id === updatedNode.id ? updatedNode : node
    ),
  },
});

export const deleteNodeFromGraph = (graph: Graph, nodeId: string): Graph => {
  const updatedEdges = graph.data.edges.filter(
    (edge) => edge.source !== nodeId && edge.target !== nodeId
  );

  return {
    ...graph,
    data: {
      ...graph.data,
      nodes: graph.data.nodes.filter((node) => node.id !== nodeId),
      edges: updatedEdges, // Update edges
    },
  };
};
