import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Loader from "./ui/Loader";
import "./App.css";
import { GraphProvider } from "./context/GraphContext";

// Lazy load components
const GraphList = lazy(() => import("./components/GraphList"));
const GraphView = lazy(() => import("./components/GraphView"));

const App: React.FC = () => {
  return (
    <Router>
      <GraphProvider>
        <header>
          <h1>Force Graph App</h1>
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
      </GraphProvider>
    </Router>
  );
};

export default App;
