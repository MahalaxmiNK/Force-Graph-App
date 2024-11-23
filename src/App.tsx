import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GraphList from "./components/GraphList";
import GraphView from "./components/GraphView";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <header>
        <h1>Maltego Coding Challenge</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<GraphList />} />
          <Route path="/graph/:id" element={<GraphView />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
