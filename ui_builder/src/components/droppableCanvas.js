import React from "react";
import { useDrop } from "react-dnd";
import RenderComponent from "./renderComponent";
import "../styles/components/DroppableCanvas.css";

const DroppableCanvas = ({
  components,
  onDrop,
  onDropInside,
  onSelect,
  selectedIndex,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      if (onDrop) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`droppable-canvas ${isOver ? "over" : ""}`}
    >
      {components.map((component, index) => (
        <RenderComponent
          key={component.id}
          component={component}
          onDropInside={onDropInside}
          onSelect={onSelect}
          selectedIndex={selectedIndex}
          index={index}
        />
      ))}
    </div>
  );
};

export default DroppableCanvas;
