import React from "react";

const ComponentInspector = ({ component, onChange }) => {
  if (!component) {
    return <p className="text-gray-500">No component selected.</p>;
  }

  const handleChange = (e) => {
    onChange({ ...component, label: e.target.value });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Component Settings</h3>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Label:
      </label>
      <input
        type="text"
        value={component.label || ""}
        onChange={handleChange}
        className="w-full px-2 py-1 border border-gray-300 rounded"
      />
    </div>
  );
};

export default ComponentInspector;
