import React from "react";
import { useGraphContext } from "../context/GraphContext";
import { useNodeOperations } from "../hooks/useNodeOperations";
import { useFilteredItems } from "../hooks/useFilteredItems";
import FilterInput from "./shared/FilterInput";
import NodeEditingForm from "./shared/NodeEditingForm";
import "./NodeOperations.css";
import FormInput from "./shared/FormInput";

const NodeOperations: React.FC = () => {
  const { graph, setGraph } = useGraphContext();
  const {
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
  } = useNodeOperations(graph, setGraph);

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
            setAddNodeErrorMessage("");
          }}
          onSubmit={addNode}
          buttonText="Add Node"
          placeholder="Enter new node name"
          className="add-node-form"
          errorMessage={addNodeErrorMessage}
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
              <NodeEditingForm
                editNodeValue={editNodeValue}
                setEditNodeValue={setEditNodeValue}
                editNodeErrorMessage={editNodeErrorMessage}
                setEditNodeErrorMessage={setEditNodeErrorMessage}
                onSubmit={(e) => {
                  e.preventDefault();
                  editNode();
                }}
                onCancel={() => {
                  setEditingNode(null);
                  setEditNodeValue("");
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodeOperations;
