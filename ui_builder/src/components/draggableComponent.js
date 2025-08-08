import React from "react";
import { useDrag } from "react-dnd";
import "../styles/components/DraggableComponent.css";

const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { ...component },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getIcon = (type) => {
    switch (type) {
      case "button":
        return "🔘";
      case "text":
        return "📝";
      case "input":
        return "⌨️";
      case "container":
        return "📦";
      default:
        return "🔧";
    }
  };

  const previewBg = component.styles?.backgroundColor || "#ffffff";
  const previewColor = component.styles?.color || "#374151";

  return (
    <div
      ref={drag}
      className={`draggable-component ${isDragging ? "dragging" : ""}`}
      role="button"
      aria-grabbed={isDragging}
    >
      <div
        className="draggable-component__icon"
        style={{
          background: previewBg,
          color: previewColor,
          border: previewBg === "transparent" ? "1px solid #e5e7eb" : undefined,
        }}
      >
        {getIcon(component.type)}
      </div>

      <div className="draggable-component__label">{component.label}</div>
    </div>
  );
};

export default DraggableComponent;
