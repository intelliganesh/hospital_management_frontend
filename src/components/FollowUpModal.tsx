import { useState } from "react";
import Button from "./button";
import Input from "./input";

interface FollowUpModalProps {
  isOpen: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onClose: () => void;
  appointment_number: string;
  onSubmit: (appointment_number: string, amount: string) => void;
}

const FollowUpModal = ({
  isOpen,
  onClose,
  appointment_number,
  onSubmit,
  size = "md",
}: FollowUpModalProps) => {
  const [fees, setFees] = useState("");

  const handleSubmit = () => {
    onSubmit(appointment_number, fees);
    setFees("");
  };
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed px-4 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClasses[size]} bg-white dark:bg-background rounded-lg shadow-lg overflow-hidden border border-border p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Follow Up Appointment</h2>
        <div className="mb-4">
          <label htmlFor="appointment-id" className=" text-sm font-medium">
            Appointment ID
          </label>
          <Input
            id="appointment_number"
            value={appointment_number}
            disabled
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fees" className="block text-sm font-medium">
            Fees
          </label>
          <Input
            id="fees"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="Enter fees amount"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="px-4 py-2 border text-white dark:text-black  rounded "
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-white dark:text-black bg-primary hover:bg-primary-600 rounded"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
