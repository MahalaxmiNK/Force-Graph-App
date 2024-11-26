import { renderHook } from "@testing-library/react-hooks";
import { useFilteredItems } from "../../src/hooks/useFilteredItems";
import { graphs } from "../../src/mocks/graphsData";

describe("useFilteredItems", () => {
  it("returns all items when filter is empty", () => {
    const { result } = renderHook(() => useFilteredItems(graphs, "", "name"));
    expect(result.current).toEqual(graphs);
  });

  it("filters items based on the provided filter", () => {
    const { result } = renderHook(() =>
      useFilteredItems(graphs, "Graph 1", "name")
    );
    expect(result.current).toEqual([graphs[0]]);
  });

  it("filters items case-insensitively", () => {
    const { result } = renderHook(() =>
      useFilteredItems(graphs, "graph 2", "name")
    );
    expect(result.current).toEqual([graphs[1]]);
  });

  it("returns no items if no match is found", () => {
    const { result } = renderHook(() =>
      useFilteredItems(graphs, "Nonexistent", "name")
    );
    expect(result.current).toEqual([]);
  });

  it("filters items using a different filter key", () => {
    const nodes = graphs[0].data.nodes;
    const { result } = renderHook(() =>
      useFilteredItems(nodes, "Node 1", "label")
    );
    expect(result.current).toEqual([nodes[0]]);
  });
});
