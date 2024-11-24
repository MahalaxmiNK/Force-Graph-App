import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container" data-testid="loader-container">
      <div className="spinner" data-testid="spinner"></div>
    </div>
  );
};

export default Loader;
