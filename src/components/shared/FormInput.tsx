import React, { FormEvent, ChangeEvent } from "react";
import Button from "../../ui/Button";

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  buttonText: string;
  onSubmit: (e: FormEvent) => void;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChange,
  placeholder = "",
  buttonText,
  onSubmit,
  className,
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
      />
      <Button type="submit" text={buttonText} />
    </form>
  );
};

export default FormInput;
