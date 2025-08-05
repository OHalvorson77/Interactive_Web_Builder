import React from "react";
import "../styles/components/componentInspector.css";

const ComponentInspector = ({ component, onChange }) => {
  if (!component) {
    return <p className="component-inspector__no-selection">No component selected.</p>;
  }

  const handleChange = (e) => {
    onChange({ ...component, label: e.target.value });
  };

  return (
    <div className="component-inspector">
      <h3 className="component-inspector__title">Component Settings</h3>
      <label className="component-inspector__label" htmlFor="labelInput">
        Label:
      </label>
      <input
        id="labelInput"
        type="text"
        value={component.label || ""}
        onChange={handleChange}
        className="component-inspector__input"
      />
    </div>
  );
};

export default ComponentInspector;
