import React from "react";

type CustomeSwitchProps = {
  isChecked: boolean;
  onChange?: (newCheckedState: boolean) => void;
  isLoading?: boolean;
};

export const CustomeSwitch: React.FC<CustomeSwitchProps> = ({
  isChecked,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className="flex-col items-center">
      <label
        // Add a class to dim the switch if it's loading, to prevent visual confusion
        className={`relative inline-flex items-center transition-opacity duration-200 ${
          isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        style={{ border: "none", outline: "none" }}
      >
        <input
          type="checkbox"
          // The checked state is now directly from the `isChecked` prop
          checked={isChecked}
          // The onChange event now calls the `onChange` function from props, if defined
          onChange={(e) => onChange && onChange(e.target.checked)}
          // Disable the input if a mutation is happening
          disabled={isLoading}
          className="sr-only peer"
        />
        <div
          className={`w-16 h-7.5 rounded-lg transition-colors duration-300 flex items-center justify-between relative z-40 ${
            isChecked ? "bg-[#d7ea86]" : "bg-[#f6f6f6]"
          }`}
          style={{ padding: "2px", border: "none", outline: "none" }}
        >
          <span
            className={`absolute left-2 text-xs font-bold z-30 ${
              isChecked ? "text-black" : "text-[#7a9f8a]"
            }`}
          >
            {/* Use isChecked prop instead of local state */}
            {isChecked && "EN"}
          </span>

          <span
            className={`absolute right-2 text-xs font-bold z-10 ${
              isChecked ? "text-[#afdf4e]" : "text-gray-600"
            }`}
          >
            {"DE"}
          </span>

          <span
            className={`inline-block w-6 h-6.5 rounded-lg transition-transform duration-300 z-30 ${
              isChecked ? "bg-white" : "bg-[#7a9f8a]"
            }`}
            style={{
              // Use isChecked prop for the transform
              transform: isChecked ? "translateX(36px)" : "translateX(0px)",
              border: "none",
              outline: "none",
            }}
          />
        </div>
      </label>
    </div>
  );
};
