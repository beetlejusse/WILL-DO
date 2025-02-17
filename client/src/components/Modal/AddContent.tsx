import { useEffect } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "../Button";

interface AddContentModalProps {
  open: boolean;
    onClose: () => void;
}

export function AddContentModal({ open, onClose }: AddContentModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      {/* Modal Content */}
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative animate-fadeIn">
        {/* Close Button */}

        {/* <X size={24} /> */}
        <div className="cursor-pointer" onClick={onClose}>
        <CrossIcon size={"md"}  />
        </div>

        {/* Modal Header */}
        <h1 className="text-2xl font-semibold text-gray-800">Add Content</h1>

        {/* Inputs */}
        <div className="mt-4 space-y-3">
          <InputBox placeholder={"Add title"} />
          <InputBox placeholder={"Add link"} />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          
          <Button
            variant={"secondary"}
            text={"Submit"}
            size={"md"}
            classname={"px-4 py-2"} />
        </div>
      </div>
    </div>
  );
}

interface InputBoxProps {
  onChange?: () => void;
  placeholder: string;
  refrence?: any;
}

export function InputBox({ onChange, placeholder, refrence }: InputBoxProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
      onChange={onChange}  
      ref={refrence} 
    />
  );
}
