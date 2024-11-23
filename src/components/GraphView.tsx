import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Graph, Node } from "../models/graphModel";
import { ForceGraph2D } from "react-force-graph";
import { HiChevronLeft } from "react-icons/hi";
import FilterInput from "./shared/FilterInput";
import FormInput from "./shared/FormInput";
import {
  fetchGraphById,
  createNode,
  updateNode,
  deleteNode as deleteNodeAPI,
} from "../services/apiService";
import "./GraphView.css";
import Button from "../ui/Button";
import Loader from "../ui/Loader";

const GraphView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [newNode, setNewNode] = useState<string>("");
  const [nodeFilter, setNodeFilter] = useState<string>("");
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editNodeValue, setEditNodeValue] = useState<string>("");

  // Load graph data
  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await fetchGraphById(id!);
        setGraph(data);
      } catch (error) {
        console.error("Error loading graph:", error);
        alert("Failed to load graph");
        navigate("/");
      }
    };
    loadGraph();
  }, [id, navigate]);

  if (!graph) return <Loader />;

  // Add a new node
  const addNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNode = newNode.trim();
    if (!trimmedNode) {
      alert("Node name cannot be empty");
      return;
    }
    if (graph.data.nodes.some((node) => node.label === trimmedNode)) {
      alert("A node with this label already exists");
      return;
    }

    const newNodeData: Node = { id: "", label: trimmedNode };

    try {
      await createNode(graph.id, newNodeData);
      setGraph((prev) =>
        prev
          ? {
              ...prev,
              data: { ...prev.data, nodes: [...prev.data.nodes, newNodeData] },
            }
          : prev
      );
      setNewNode("");
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Failed to add node");
    }
  };

  // Edit a node
  const editNode = async () => {
    if (!editNodeValue.trim()) {
      alert("Node name cannot be empty");
      return;
    }

    const updatedNode = { ...editingNode, label: editNodeValue.trim() } as Node;

    try {
      await updateNode(graph.id, editingNode!.id, updatedNode);
      setGraph((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                nodes: prev.data.nodes.map((node) =>
                  node.id === editingNode!.id ? updatedNode : node
                ),
              },
            }
          : prev
      );
      setEditingNode(null);
      setEditNodeValue("");
    } catch (error) {
      console.error("Error editing node:", error);
      alert("Failed to update node");
    }
  };

  // Delete a node
  const deleteNode = async (nodeId: string) => {
    try {
      await deleteNodeAPI(graph.id, nodeId);
      setGraph((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                nodes: prev.data.nodes.filter((node) => node.id !== nodeId),
              },
            }
          : prev
      );
    } catch (error) {
      console.error("Error deleting node:", error);
      alert("Failed to delete node");
    }
  };

  // Filter nodes based on input
  const filteredNodes = graph.data.nodes.filter((node) =>
    node.label.toLowerCase().includes(nodeFilter.toLowerCase())
  );

  return (
    <div className="page-container">
      <button
        onClick={() => navigate("/")}
        aria-label="Back to Graph List"
        className="back-button"
      >
        <HiChevronLeft />
        Back to Graph List
      </button>
      <h2>{graph.name}</h2>
      <FormInput
        value={newNode}
        onChange={setNewNode}
        onSubmit={addNode}
        buttonText="Add Node"
        placeholder="Enter new node name"
        className="add-node-form"
      />
      <div className="main-content">
        {/* Left Section: Graph */}
        <div className="graph-section" aria-label="Graph visualization">
          <ForceGraph2D
            graphData={{
              nodes: graph.data.nodes,
              links: graph.data.edges || [],
            }}
            height={580}
            width={780}
            nodeLabel={(node) => (node as Node).label}
            nodeColor={() => "#ffb30f"}
            linkColor={() => "#c1c3c7"}
          />
        </div>

        {/* Right Section: Node List */}
        <div className="node-section">
          <FilterInput
            value={nodeFilter}
            onChange={setNodeFilter}
            placeholder="Search nodes"
            className="filter-input"
            aria-label="Filter nodes"
          />
          <ul className="node-list">
            {filteredNodes.map((node) => (
              <li
                key={node.id}
                tabIndex={0}
                role="listitem"
                className="node-item"
              >
                <span className="node-label">{node.label}</span>
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
              </li>
            ))}
          </ul>

          {editingNode && (
            <div className="edit-form">
              <input
                type="text"
                value={editNodeValue}
                onChange={(e) => setEditNodeValue(e.target.value)}
                aria-label="Edit node name"
              />
              <Button
                text="Save"
                type="button"
                onClick={editNode}
                className="save-button"
              />
              <Button
                text="Cancel"
                type="reset"
                className="cancel"
                ariaLabel="Cancel"
                onClick={() => {
                  setEditingNode(null);
                  setEditNodeValue("");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphView;
