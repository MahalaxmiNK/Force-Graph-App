import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Graph, Node } from "../models/graphModel";
import { ForceGraph2D } from "react-force-graph";
import { HiChevronLeft } from "react-icons/hi";
import FilterInput from "./shared/FilterInput";
import FormInput from "./shared/FormInput";
import { fetchGraphById } from "../services/apiService";
import "./GraphView.css";

const GraphView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [newNode, setNewNode] = useState<string>("");
  const [nodeFilter, setNodeFilter] = useState<string>("");

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await fetchGraphById(id!);
        setGraph(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load graph");
        navigate("/");
      }
    };

    loadGraph();
  }, [id, navigate]);

  if (!graph) return <p>Loading...</p>;

  const addNode = (e: React.FormEvent) => {
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
    const newNodeData: Node = { id: `node_${Date.now()}`, label: trimmedNode };
    setGraph((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        data: { ...prev.data, nodes: [...prev.data.nodes, newNodeData] },
      };
    });
    setNewNode("");
  };

  const filteredNodes = graph.data.nodes.filter((node) =>
    node.label.toLowerCase().includes(nodeFilter.toLowerCase())
  );

  return (
    <div className="page-container">
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
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
      <FilterInput
        value={nodeFilter}
        onChange={setNodeFilter}
        placeholder="Search nodes"
        className="filter-input"
      />
      <div className="force-graph-container">
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
      <ul>
        {filteredNodes.map((node) => (
          <li key={node.id}>{node.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default GraphView;
