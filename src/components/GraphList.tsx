import React, { useState, useEffect, FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { Graph } from "../models/graphModel";
import { MdOutlineDelete } from "react-icons/md";
import "./GraphList.css";

const GraphList: React.FC = () => {
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [newGraphName, setNewGraphName] = useState<string>("");

  const fetchGraphs = async () => {
    const response = await fetch("/api/graphs");
    setGraphs(await response.json());
  };

  const deleteGraph = async (id: string) => {
    await fetch(`/api/graphs/${id}`, { method: "DELETE" });
    fetchGraphs();
  };

  const createGraph = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGraphName.trim()) {
      alert("Graph name cannot be empty!");
      return;
    }
    const newGraph: Graph = {
      id: "",
      name: newGraphName,
      data: {
        nodes: [],
        edges: [],
      },
    };
    await fetch("/api/graphs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGraph),
    });

    setNewGraphName("");
    fetchGraphs();
  };

  useEffect(() => {
    fetchGraphs();
  }, []);

  const filteredGraphs = graphs.filter((graph) =>
    graph.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="graph-list-container">
      <h2>Graphs</h2>
      <input
        className="filter-input"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name"
      />
      <form className="graph-list-form" onSubmit={createGraph}>
        <input
          type="text"
          value={newGraphName}
          onChange={(e) => setNewGraphName(e.target.value)}
          placeholder="New Graph Name"
        />
        <button type="submit">Add Graph</button>
      </form>

      <div className="graph-cards">
        {filteredGraphs.map((graph) => (
          <NavLink
            to={`/graph/${graph.id}`}
            key={graph.id}
            className="graph-card"
          >
            <h3>{graph.name}</h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation on button click
                deleteGraph(graph.id);
              }}
            >
              <MdOutlineDelete />
            </button>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default GraphList;
