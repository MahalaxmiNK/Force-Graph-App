import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Graph } from "../models/graphModel";
import FilterInput from "./shared/FilterInput";
import FormInput from "./shared/FormInput";
import { fetchGraphs, createGraph, deleteGraph } from "../services/apiService";
import "./GraphList.css";
import { useFilteredItems } from "../hooks/useFilteredItems";

const GraphList: React.FC = () => {
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [newGraphName, setNewGraphName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadGraphs = useCallback(async () => {
    try {
      const data = await fetchGraphs();
      setGraphs(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load graphs");
    }
  }, []);

  const handleCreateGraph = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!newGraphName.trim()) {
        setErrorMessage("Graph name cannot be empty!");
        return;
      }
      const newGraph: Graph = {
        id: "",
        name: newGraphName,
        data: { nodes: [], edges: [] },
      };

      try {
        await createGraph(newGraph);
        setNewGraphName("");
        setErrorMessage("");
        loadGraphs();
      } catch (error) {
        console.error(error);
        alert("Failed to create graph");
      }
    },
    [newGraphName, loadGraphs]
  );

  const handleDeleteGraph = useCallback(
    async (id: string) => {
      try {
        await deleteGraph(id);
        loadGraphs();
      } catch (error) {
        console.error(error);
        alert("Failed to delete graph");
      }
    },
    [loadGraphs]
  );

  useEffect(() => {
    loadGraphs();
  }, [loadGraphs]);

  const filteredGraphs = useFilteredItems(graphs, filter, "name");

  return (
    <section className="graph-list-container" aria-label="Graph List Section">
      <h2>Graphs</h2>
      <FilterInput
        value={filter}
        onChange={setFilter}
        placeholder="Filter by name"
        className="filter-input"
      />
      <FormInput
        value={newGraphName}
        onChange={(value) => {
          setNewGraphName(value);
          setErrorMessage("");
        }}
        onSubmit={handleCreateGraph}
        buttonText="Add Graph"
        placeholder="New Graph Name"
        className="graph-list-form"
        errorMessage={errorMessage}
      />
      <div className="graph-cards">
        {filteredGraphs.map((graph) => (
          <NavLink
            to={`/graph/${graph.id}`}
            key={graph.id}
            className="graph-card"
            aria-label={`View details for graph ${graph.name}`}
          >
            <article>
              <h3>{graph.name}</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteGraph(graph.id);
                }}
                aria-label={`Delete graph ${graph.name}`}
              >
                🗑
              </button>
            </article>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default GraphList;
