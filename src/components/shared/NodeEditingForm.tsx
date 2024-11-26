import React from "react";
import FormInput from "./FormInput";
import Button from "../../ui/Button";

interface NodeEditingFormProps {
  editNodeValue: string;
  setEditNodeValue: React.Dispatch<React.SetStateAction<string>>;
  setEditNodeErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  editNodeErrorMessage: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const NodeEditingForm: React.FC<NodeEditingFormProps> = ({
  editNodeValue,
  setEditNodeValue,
  editNodeErrorMessage,
  setEditNodeErrorMessage,
  onSubmit,
  onCancel,
}) => (
  <div className="edit-form">
    <FormInput
      value={editNodeValue}
      onChange={(value) => {
        setEditNodeValue(value);
        setEditNodeErrorMessage("");
      }}
      onSubmit={onSubmit}
      buttonText="Save"
      placeholder="Edit node name"
      errorMessage={editNodeErrorMessage}
    />
    <Button text="Cancel" type="reset" ariaLabel="Cancel" onClick={onCancel} />
  </div>
);

export default NodeEditingForm;
