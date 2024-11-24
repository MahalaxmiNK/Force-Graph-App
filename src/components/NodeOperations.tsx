import React, { useState } from "react";
import { Graph, Node } from "../models/graphModel";
import {
  createNode,
  updateNode,
  deleteNode as deleteNodeAPI,
} from "../services/apiService";
import {
  addNodeToGraph,
  updateNodeInGraph,
  deleteNodeFromGraph,
} from "../utils/graphUtils";
import Button from "../ui/Button";
import FormInput from "./shared/FormInput";
import FilterInput from "./shared/FilterInput";
import "./NodeOperations.css";

interface NodeOperationsProps {
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>;
}

const NodeOperations: React.FC<NodeOperationsProps> = ({ graph, setGraph }) => {
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

    if (graph.data.nodes.some((node) => node.label === trimmedNode)) {
      setErrorMessage("A node with this label already exists");
      return;
    }

    try {
      const createdNode: Node = await createNode(graph.id, {
        label: trimmedNode,
        id: "",
      });

      handleGraphUpdate((g) => addNodeToGraph(g, createdNode));
      setNewNode(""); // Clear input field
      setErrorMessage("");
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
      await updateNode(graph.id, editingNode!.id, updatedNode);
      handleGraphUpdate((g) => updateNodeInGraph(g, updatedNode));
      setEditingNode(null);
      setEditNodeValue("");
    } catch (error) {
      console.error("Error editing node:", error);
      alert("Failed to update node");
    }
  };

  const deleteNode = async (nodeId: string) => {
    try {
      await deleteNodeAPI(graph.id, nodeId);
      handleGraphUpdate((g) => deleteNodeFromGraph(g, nodeId));
    } catch (error) {
      console.error("Error deleting node:", error);
      alert("Failed to delete node");
    }
  };

  const filteredNodes = graph.data.nodes.filter((node) =>
    node.label.toLowerCase().includes(nodeFilter.toLowerCase())
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
                onClick={() => deleteNode(node.id)}
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
