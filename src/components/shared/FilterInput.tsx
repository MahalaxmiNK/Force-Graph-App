import React, { ChangeEvent } from "react";
import useDebounce from "../../hooks/useDebounce";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) => {
  const debouncedValue = useDebounce(value, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={debouncedValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default FilterInput;
