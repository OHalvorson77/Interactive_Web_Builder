import React from "react";
import "../styles/components/componentInspector.css";

const ComponentInspector = ({ component, onChange }) => {
  if (!component) {
    return (
      <p className="component-inspector__no-selection">
        No component selected.
      </p>
    );
  }

  const handleLabelChange = (e) => {
    onChange({ ...component, label: e.target.value });
  };

  const handleStyleChange = (key, value) => {
    const updatedStyles = { ...component.styles, [key]: value };
    onChange({ ...component, styles: updatedStyles });
  };

  const renderStyleField = (key, value) => {
    let inputType = "text";
    if (typeof value === "number") inputType = "number";
    if (typeof value === "boolean") inputType = "checkbox";
    if (
      typeof value === "string" &&
      /^#([0-9A-F]{3}){1,2}$/i.test(value) // hex color
    ) {
      inputType = "color";
    }

    return (
      <div key={key} className="component-inspector__field">
        <label className="component-inspector__label">{key}:</label>

        {inputType === "checkbox" ? (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleStyleChange(key, e.target.checked)}
            className="component-inspector__input"
          />
        ) : (
          <input
            type={inputType}
            value={value}
            onChange={(e) =>
              handleStyleChange(
                key,
                inputType === "number" ? Number(e.target.value) : e.target.value
              )
            }
            className="component-inspector__input"
          />
        )}
      </div>
    );
  };

  return (
    <div className="component-inspector">
      <h3 className="component-inspector__title">Component Settings</h3>

      <div className="component-inspector__field">
        <label className="component-inspector__label" htmlFor="labelInput">
          Label:
        </label>
        <input
          id="labelInput"
          type="text"
          value={component.label || ""}
          onChange={handleLabelChange}
          className="component-inspector__input"
        />
      </div>

      <h4 className="component-inspector__subtitle">Styles</h4>
      {Object.entries(component.styles || {}).map(([key, value]) =>
        renderStyleField(key, value)
      )}
    </div>
  );
};

export default ComponentInspector;
