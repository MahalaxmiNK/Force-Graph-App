import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Graph, Node } from "../models/graphModel";
import { ForceGraph2D } from "react-force-graph";
import { HiChevronLeft } from "react-icons/hi";
import "./GraphView.css";

const GraphView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [newNode, setNewNode] = useState<string>("");
  const [nodeFilter, setNodeFilter] = useState<string>("");

  // Fetch graph data
  useEffect(() => {
    // to be moved
    const fetchGraph = async () => {
      try {
        const response = await fetch(`/api/graphs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGraph(data);
        } else {
          alert("Graph not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching graph:", error);
        alert("An error occurred while loading the graph.");
      }
    };

    fetchGraph();
  }, [id, navigate]);

  if (!graph) return <p>Loading...</p>;

  // Add a new node
  const addNode = () => {
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

  // Filter nodes by search input
  // to be moved
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
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={newNode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewNode(e.target.value)
          }
          placeholder="Enter new node name"
        />
        <button onClick={addNode} className="add-node">
          Add Node
        </button>
      </div>

      {/* Node Search */}
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={nodeFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNodeFilter(e.target.value)
          }
          placeholder="Search nodes"
        />
      </div>

      {/* Force Graph */}
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
