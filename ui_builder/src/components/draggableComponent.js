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

  return (
    <div
      ref={drag}
      className={`draggable-component ${isDragging ? "dragging" : ""}`}
    >
      {component.label}
    </div>
  );
};

export default DraggableComponent;
