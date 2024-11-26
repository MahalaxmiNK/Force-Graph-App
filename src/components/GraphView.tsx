import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Graph } from "../models/graphModel";
import { fetchGraphById } from "../services/apiService";
import Loader from "../ui/Loader";
import "./GraphView.css";
import GraphVisualization from "./GraphVisualization";
import NodeOperations from "./NodeOperations";
import AddEdgeModal from "./AddEdgeModal";
import Button from "../ui/Button";

const GraphView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      <header className="header-section">
        <h2>{graph.name}</h2>

        <Button
          type="button"
          text="Add Edge"
          className="add-edge-button"
          onClick={openModal}
        />
      </header>

      <div className="main-content">
        <GraphVisualization graph={graph} />
        <NodeOperations graph={graph} setGraph={setGraph} />
      </div>
      <AddEdgeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        graph={graph}
        setGraph={setGraph}
      />
    </div>
  );
};

export default GraphView;
