import React, { useState } from "react";
import { Graph } from "../models/graphModel";
import Modal from "../ui/Modal";
import { createEdge } from "../services/apiService";
import "./AddEdgeModal.css";

interface AddEdgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>;
}

const AddEdgeModal: React.FC<AddEdgeModalProps> = ({
  isOpen,
  onClose,
  graph,
  setGraph,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const resetState = () => {
    setSelectedSource("");
    setSelectedTarget("");
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAddEdge = async () => {
    if (!selectedSource || !selectedTarget) {
      setError("Please select both source and target nodes.");
      return;
    }
    if (selectedSource === selectedTarget) {
      setError("Source and target nodes must be different");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newEdge = { source: selectedSource, target: selectedTarget };
      const addedEdge = await createEdge(graph.id, newEdge);

      // Update the graph state with the new edge
      const updatedGraph = {
        ...graph,
        data: { ...graph.data, edges: [...graph.data.edges, addedEdge] },
      };
      setGraph(updatedGraph);
      handleClose();
    } catch {
      setError("Failed to add edge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="modal-title" role="heading" aria-level={3}>
        Add Edge
      </h3>

      <div
        className="dropdown"
        role="group"
        aria-labelledby="source-node-label"
      >
        <label htmlFor="source-node">Source Node</label>
        <select
          id="source-node"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          aria-label="Select Source Node"
        >
          <option value="">Select Source</option>
          {graph.data.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className="dropdown"
        role="group"
        aria-labelledby="target-node-label"
      >
        <label htmlFor="target-node">Target Node</label>
        <select
          id="target-node"
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          aria-label="Select Target Node"
        >
          <option value="">Select Target</option>
          {graph.data.nodes
            .filter((node) => node.id !== selectedSource)
            .map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
        </select>
      </div>

      <button
        className="add-edge-btn"
        onClick={handleAddEdge}
        disabled={loading}
        role="button"
      >
        {loading ? "Adding..." : "Add Edge"}
      </button>

      {error && <p className="error">{error}</p>}
    </Modal>
  );
};

export default AddEdgeModal;
