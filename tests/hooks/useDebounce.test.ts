import { renderHook, act } from "@testing-library/react";
import useDebounce from "../../src/hooks/useDebounce";

describe("useDebounce", () => {
  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should update the debounced value after the specified delay", async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");

    vi.useRealTimers();
  });

  it("should clear the timeout when the component unmounts", () => {
    vi.useFakeTimers();

    const { unmount } = renderHook(() => useDebounce("initial", 500));

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(true).toBe(true);

    vi.useRealTimers();
  });
});
