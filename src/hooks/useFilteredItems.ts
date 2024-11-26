import { useMemo } from "react";

export const useFilteredItems = <T>(
  items: T[],
  filter: string,
  filterKey: keyof T
): T[] => {
  return useMemo(() => {
    const lowerCaseFilter = filter.toLowerCase();
    return items.filter((item) => {
      const value = item[filterKey];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(lowerCaseFilter)
      );
    });
  }, [items, filter, filterKey]);
};
