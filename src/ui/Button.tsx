// src/components/ui/Button.tsx
import React from "react";
import "./Button.css";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`button ${className}`}
    aria-label={ariaLabel}
  >
    {text}
  </button>
);

export default Button;
