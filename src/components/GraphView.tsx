import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Graph } from "../models/graphModel";
import { fetchGraphById } from "../services/apiService";
import Loader from "../ui/Loader";
import "./GraphView.css";
import GraphVisualization from "./GraphVisualization";
import NodeOperations from "./NodeOperations";

const GraphView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [graph, setGraph] = useState<Graph | null>(null);

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

  return (
    <div className="page-container">
      <button
        onClick={() => navigate("/")}
        aria-label="Back to Graph List"
        className="back-button"
      >
        {" "}
        <span className="arrow">&#8592;</span>
        Back to Graph List
      </button>
      <h2>{graph.name}</h2>
      <div className="main-content">
        <GraphVisualization graph={graph} />
        <NodeOperations graph={graph} setGraph={setGraph} />
      </div>
    </div>
  );
};

export default GraphView;
