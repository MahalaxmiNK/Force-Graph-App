// src/context/GraphContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";
import { Graph } from "../models/graphModel";

// Define the context type
interface GraphContextType {
  graph: Graph | null;
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>;
}

// Create a default context with `null` graph
const GraphContext = createContext<GraphContextType | undefined>(undefined);

// Context provider component
export const GraphProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [graph, setGraph] = useState<Graph | null>(null);

  return (
    <GraphContext.Provider value={{ graph, setGraph }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = (): GraphContextType => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return context;
};
