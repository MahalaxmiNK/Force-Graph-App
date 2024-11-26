// src/components/NodeOperations.tsx
import React, { useState } from "react";
import { Graph, Node } from "../models/graphModel";
import { createNode, updateNode, deleteNode } from "../services/apiService";
import { addNodeToGraph, updateNodeInGraph } from "../utils/graphUtils";
import Button from "../ui/Button";
import FormInput from "./shared/FormInput";
import FilterInput from "./shared/FilterInput";
import { useFilteredItems } from "../hooks/useFilteredItems";
import { useGraphContext } from "../context/GraphContext";
import "./NodeOperations.css";

const NodeOperations: React.FC = () => {
  const { graph, setGraph } = useGraphContext();
  const [newNode, setNewNode] = useState<string>("");
  const [nodeFilter, setNodeFilter] = useState<string>("");
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editNodeValue, setEditNodeValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleGraphUpdate = (updater: (graph: Graph) => Graph) => {
    setGraph((prev) => (prev ? updater(prev) : prev));
  };

  const addNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNode = newNode.trim();

    if (!trimmedNode) {
      setErrorMessage("Node name cannot be empty!");
      return;
    }

    if (graph?.data.nodes.some((node) => node.label === trimmedNode)) {
      setErrorMessage("A node with this label already exists");
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
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Failed to add node");
    }
  };

  const editNode = async () => {
    if (!editNodeValue.trim()) {
      setErrorMessage("Node name cannot be empty");
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

  const filteredNodes = useFilteredItems(
    graph?.data.nodes || [],
    nodeFilter,
    "label"
  );

  return (
    <div className="node-section">
      <div className="input-section">
        <FilterInput
          value={nodeFilter}
          onChange={setNodeFilter}
          placeholder="Search nodes"
          className="filter-input-style"
          aria-label="Filter nodes"
        />
        <FormInput
          value={newNode}
          onChange={(value) => {
            setNewNode(value);
            setErrorMessage("");
          }}
          onSubmit={addNode}
          buttonText="Add Node"
          placeholder="Enter new node name"
          className="add-node-form"
          errorMessage={errorMessage}
        />
      </div>

      <h3>Nodes</h3>

      <ul className="node-list">
        {filteredNodes.map((node) => (
          <li key={node.id} tabIndex={0} role="listitem" className="node-item">
            <span className="node-label" title={node.label}>
              {node.label}
            </span>
            <div className="node-actions">
              <button
                onClick={() => {
                  setEditingNode(node);
                  setEditNodeValue(node.label);
                }}
                aria-label={`Edit node ${node.label}`}
                className="edit-button"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteNode(node.id)}
                aria-label={`Delete node ${node.label}`}
                className="delete-button"
              >
                🗑
              </button>
            </div>
            {editingNode?.id === node.id && (
              <div className="edit-form">
                <FormInput
                  value={editNodeValue}
                  onChange={(value) => {
                    setEditNodeValue(value);
                    setErrorMessage("");
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    editNode();
                  }}
                  buttonText="Save"
                  placeholder="Edit node name"
                  errorMessage={errorMessage}
                />
                <Button
                  text="Cancel"
                  type="reset"
                  ariaLabel="Cancel"
                  onClick={() => {
                    setEditingNode(null);
                    setEditNodeValue("");
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodeOperations;
