export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface Graph {
  id: string;
  name: string;
  data: GraphData;
}
