import React from "react";
import DraggableComponent from "./draggableComponent";
import { COMPONENTS } from "../data/COMPONENTS"; // update path as needed
import "../styles/components/DraggableComponent.css";

const ComponentsPanel = () => {
  return (
    <div className="components-panel">
      <h4 className="components-panel__title">Components</h4>

      {/* grid wrapper */}
      <div className="draggable-components-grid">
        {COMPONENTS.map((comp, idx) => (
          <DraggableComponent key={`${comp.type}-${idx}`} component={comp} />
        ))}
      </div>
    </div>
  );
};

export default ComponentsPanel;
