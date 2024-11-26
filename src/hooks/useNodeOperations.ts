import { useState } from "react";
import { Graph, Node } from "../models/graphModel";
import { createNode, updateNode, deleteNode } from "../services/apiService";
import { addNodeToGraph, updateNodeInGraph } from "../utils/graphUtils";

export const useNodeOperations = (
  graph: Graph | null,
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>
) => {
  const [newNode, setNewNode] = useState<string>("");
  const [nodeFilter, setNodeFilter] = useState<string>("");
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editNodeValue, setEditNodeValue] = useState<string>("");
  const [addNodeErrorMessage, setAddNodeErrorMessage] = useState<string>("");
  const [editNodeErrorMessage, setEditNodeErrorMessage] = useState<string>("");

  const handleGraphUpdate = (updater: (graph: Graph) => Graph) => {
    setGraph((prev) => (prev ? updater(prev) : prev));
  };

  const addNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNode = newNode.trim();

    if (!trimmedNode) {
      setAddNodeErrorMessage("Node name cannot be empty!");
      return;
    }

    if (graph?.data.nodes.some((node) => node.label === trimmedNode)) {
      setAddNodeErrorMessage("A node with this label already exists");
      return;
    }

    try {
      if (graph) {
        const createdNode: Node = await createNode(graph.id, {
          label: trimmedNode,
          id: "",
        });

        handleGraphUpdate((g) => addNodeToGraph(g, createdNode));
        setNewNode("");
      }
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Failed to add node");
    }
  };

  const editNode = async () => {
    if (!editNodeValue.trim()) {
      setEditNodeErrorMessage("Node name cannot be empty");
      return;
    }

    const updatedNode = { ...editingNode, label: editNodeValue.trim() } as Node;

    try {
      if (graph) {
        await updateNode(graph.id, editingNode!.id, updatedNode);
        handleGraphUpdate((g) => updateNodeInGraph(g, updatedNode));
        setEditingNode(null);
        setEditNodeValue("");
      }
    } catch (error) {
      console.error("Error editing node:", error);
      alert("Failed to update node");
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    if (graph) {
      try {
        await deleteNode(graph.id, nodeId);

        setGraph((prevGraph) => {
          if (!prevGraph) return null;

          const updatedGraph = {
            ...prevGraph,
            data: {
              ...prevGraph.data,
              nodes: prevGraph.data.nodes.filter((node) => node.id !== nodeId),
              edges: prevGraph.data.edges.filter(
                (edge) => edge.source !== nodeId && edge.target !== nodeId
              ),
            },
          };

          return updatedGraph;
        });
      } catch (error) {
        console.error("Error deleting node:", error);
        alert("Failed to delete node");
      }
    }
  };

  return {
    newNode,
    setNewNode,
    nodeFilter,
    setNodeFilter,
    editingNode,
    setEditingNode,
    editNodeValue,
    setEditNodeValue,
    editNodeErrorMessage,
    setEditNodeErrorMessage,
    addNodeErrorMessage,
    setAddNodeErrorMessage,
    addNode,
    editNode,
    handleDeleteNode,
  };
};
