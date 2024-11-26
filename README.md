# MALTEGO CODING CHALLENGE

This project is built using **Vite**, **React**, and **Typescript**. The application provides features for managing and interacting with graphs, including adding, deleting, and filtering graphs, as well as viewing force-directed graphs.

## Features

- **Display Graph List**: View a list of all available graphs.
- **Add New Graph**: Create and add new graphs to the application.
- **Delete Graph**: Remove an existing graph from the list.
- **Filter/Search Graph**: Search and filter graphs by name.
- **View Force-Directed Graph**: Navigate to a specific graph by `GraphID` to visualize it using a force-directed graph layout. This is implemented with the `react-force-graph` library.
- **Node Management**:
  - **Create Node**: Add new nodes to the graph.
  - **Update Node**: Modify the name of an existing node.
  - **Delete Node**: Remove a node from the graph.
  - **Bonus Feature – Add Edges**: Create edges between nodes to establish connections within the graph.

## Technology Stack

- **Frontend**: React, TypeScript
- **Backend Simulation**: Mocked with **MSW (Mock Service Worker)** for in-memory data management (no database used).
- **Styling**: Pure **CSS** and **HTML** (no external styling libraries).
- **Graph Visualization**: `react-force-graph` for rendering force-directed graphs.

## Project Setup

### Prerequisites

Ensure that you have the following installed:

- **Node.js** (v14 or later)
- **npm** (or **yarn**)

- Go to project directory
  **npm install**
- to run the application
  **npm run dev**

- to run the unit tests
  **npm run test**

- to run the e2e tests (make sure you are running application)
  **npm run e2e**
