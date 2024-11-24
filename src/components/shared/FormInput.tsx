import { ChangeEvent, FormEvent } from "react";
import Button from "../../ui/Button";
import "./FormInput.css";

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  buttonText: string;
  onSubmit: (e: FormEvent) => void;
  className?: string;
  errorMessage?: string; // Add this prop
}

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChange,
  placeholder = "",
  buttonText,
  onSubmit,
  className,
  errorMessage,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <form className={className} onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
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
