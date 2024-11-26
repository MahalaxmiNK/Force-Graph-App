import {
  addNodeToGraph,
  deleteNodeFromGraph,
  updateNodeInGraph,
} from "../../src/utils/graphUtils";
import { Graph, Node } from "../../src/models/graphModel";
import { graphs } from "../../src/mocks/graphsData";

describe("addNodeToGraph", () => {
  it("should add a new node to the first graph (Graph 1)", () => {
    const graph: Graph = graphs[0];
    const newNode: Node = { id: "nd_5", label: "Node 5" };

    const updatedGraph = addNodeToGraph(graph, newNode);

    expect(updatedGraph.data.nodes).toHaveLength(5);
    expect(updatedGraph.data.nodes[4]).toEqual(newNode); // Verify that the new node is added
  });

  it("should add a new node to the second graph (Graph 2)", () => {
    const graph: Graph = graphs[1];
    const newNode: Node = { id: "nd_3", label: "Node 3" };

    const updatedGraph = addNodeToGraph(graph, newNode);

    expect(updatedGraph.data.nodes).toHaveLength(3);
    expect(updatedGraph.data.nodes[2]).toEqual(newNode);
  });
});

describe("updateNodeInGraph", () => {
  it("should update the label of a node in Graph 1", () => {
    const graph: Graph = graphs[0]; // Using Graph 1
    const updatedNode: Node = { id: "nd_1", label: "Updated Node 1" };

    const updatedGraph = updateNodeInGraph(graph, updatedNode);

    expect(updatedGraph.data.nodes).toHaveLength(4); // Node count should remain the same
    expect(updatedGraph.data.nodes[0].label).toBe("Updated Node 1"); // Check if the node label was updated
  });

  it("should not modify other nodes in Graph 2 when updating a node", () => {
    const graph: Graph = graphs[1]; // Using Graph 2
    const updatedNode: Node = { id: "nd_1", label: "Updated Node 1" };

    const updatedGraph = updateNodeInGraph(graph, updatedNode);

    expect(updatedGraph.data.nodes).toHaveLength(2); // Node count should remain the same
    expect(updatedGraph.data.nodes[0].label).toBe("Updated Node 1"); // Check if the label was updated
    expect(updatedGraph.data.nodes[1].label).toBe("Node 2"); // Ensure the other node is unchanged
  });
});

describe("deleteNodeFromGraph", () => {
  it("should delete a node by id from Graph 1", () => {
    const graph: Graph = graphs[0]; // Using Graph 1
    const nodeIdToDelete = "nd_1";

    const updatedGraph = deleteNodeFromGraph(graph, nodeIdToDelete);

    expect(updatedGraph.data.nodes).toHaveLength(3); // Should have 3 nodes after deletion
    expect(
      updatedGraph.data.nodes.find((node) => node.id === nodeIdToDelete)
    ).toBeUndefined(); // Node with id 'nd_1' should be deleted
  });

  it("should not modify the graph if the node to delete does not exist in Graph 2", () => {
    const graph: Graph = graphs[1]; // Using Graph 2
    const nodeIdToDelete = "nd_3"; // Node with id 'nd_3' doesn't exist

    const updatedGraph = deleteNodeFromGraph(graph, nodeIdToDelete);

    expect(updatedGraph.data.nodes).toHaveLength(2); // Node count should remain the same
    expect(updatedGraph.data.nodes).toEqual(graph.data.nodes); // Ensure the nodes are unchanged
  });
});
