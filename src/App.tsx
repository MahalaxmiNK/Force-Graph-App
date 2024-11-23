import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Loader from "./ui/Loader";
import "./App.css";

// Lazy load components
const GraphList = lazy(() => import("./components/GraphList"));
const GraphView = lazy(() => import("./components/GraphView"));

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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<GraphList />} />
            <Route path="/graph/:id" element={<GraphView />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
};

export default App;
