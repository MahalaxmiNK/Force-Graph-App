import { renderHook, act } from "@testing-library/react-hooks";
import { vi } from "vitest";

import { Graph } from "../../src/models/graphModel";
import { useNodeOperations } from "../../src/hooks/useNodeOperations";

vi.mock("../services/apiService");
vi.mock("../utils/graphUtils");

describe("useNodeOperations", () => {
  let graph: Graph | null;
  let setGraph: vi.Mock;

  beforeEach(() => {
    graph = {
      id: "graph1",
      name: "Test Graph",
      data: {
        nodes: [{ id: "nd_1", label: "Node 1" }],
        edges: [],
      },
    };
    setGraph = vi.fn();
  });

  it("should handle error when adding a new node with empty name", async () => {
    const { result } = renderHook(() => useNodeOperations(graph, setGraph));

    await act(async () => {
      result.current.setNewNode("");
      await result.current.addNode({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.addNodeErrorMessage).toBe(
      "Node name cannot be empty!"
    );
  });

  it("should handle error when editing a node with empty name", async () => {
    const editingNode = { id: "nd_1", label: "Node 1" };

    const { result } = renderHook(() => useNodeOperations(graph, setGraph));

    await act(async () => {
      result.current.setEditingNode(editingNode);
      result.current.setEditNodeValue("");
      await result.current.editNode();
    });

    expect(result.current.editNodeErrorMessage).toBe(
      "Node name cannot be empty"
    );
  });
});
