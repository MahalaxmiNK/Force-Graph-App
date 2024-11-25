import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../../ui/Button";
import "./FormInput.css";

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  buttonText: string;
  onSubmit: (e: FormEvent) => void;
  className?: string;
  errorMessage?: string;
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9\s]/g, ""); // Allows letters, numbers, and spaces
};

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChange,
  placeholder = "",
  buttonText,
  onSubmit,
  className,
  errorMessage,
}) => {
  const [sanitizedValue, setSanitizedValue] = useState(value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeInput(rawValue);
    setSanitizedValue(sanitized);
    onChange(sanitized);
  };

  return (
    <form className={className} onSubmit={onSubmit} role="form">
      <input
        type="text"
        value={sanitizedValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        aria-describedby={errorMessage ? "error-message" : undefined}
        aria-invalid={!!errorMessage}
        className={errorMessage ? "input-error" : ""}
      />
      <Button type="submit" text={buttonText} />
      {errorMessage && (
        <p id="error-message" className="error-message">
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default FormInput;
