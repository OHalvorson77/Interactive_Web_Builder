import React from "react";
import { useDrop } from "react-dnd";

const RenderComponent = ({
  component,
  onDropInside,
  onSelect,
  selectedIndex,
  index,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item) => {
      onDropInside(item, index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(index);
  };

  const wrapperStyle = {
    ...component.styles,
    outline: isOver ? "2px dashed #a78bfa" : "none",
  };

  if (component.type === "container") {
    return (
      <div
        ref={drop}
        className={`p-2 m-2 border border-purple-300 bg-gray-100 rounded ${
          selectedIndex === index ? "ring-2 ring-purple-500" : ""
        }`}
        style={wrapperStyle}
        onClick={handleClick}
      >
        {component.children?.map((child, i) => (
          <RenderComponent
            key={child.id}
            component={child}
            onDropInside={(childItem) =>
              onDropInside(childItem, index, i)
            }
            onSelect={onSelect}
            selectedIndex={selectedIndex}
            index={i}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className={`p-2 m-2 border ${
        selectedIndex === index ? "ring-2 ring-purple-500" : ""
      }`}
      style={wrapperStyle}
      onClick={handleClick}
    >
      {component.type === "button" && (
        <button className="px-4 py-2 bg-purple-600 text-white rounded shadow">
          {component.text || "Button"}
        </button>
      )}
      {component.type === "text" && (
        <p>{component.text || "Text"}</p>
      )}
      {component.type === "input" && (
        <input className="p-2 border rounded w-full" placeholder="Input" />
      )}
    </div>
  );
};

export default RenderComponent;
