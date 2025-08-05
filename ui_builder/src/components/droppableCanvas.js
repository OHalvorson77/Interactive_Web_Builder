import React from "react";
import { useDrop } from "react-dnd";
import RenderComponent from "./renderComponent";

const DroppableCanvas = ({
  components,
  onDrop,
  onDropInside,
  onSelect,
  selectedIndex,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[500px] border-2 border-dashed rounded-md p-4 ${
        isOver ? "border-purple-400 bg-purple-50" : "border-gray-300"
      }`}
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
