import React from "react";
import { useDrop } from "react-dnd";
import "../styles/components/RenderComponent.css";

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
      if (component.type === "container") {
        onDropInside(item, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(index);
  };

  const inlineStyle = {
    ...component.styles,
    outline: isOver ? "2px dashed #a78bfa" : "none",
  };

  // CONTAINER: droppable area that can hold children
  if (component.type === "container") {
    return (
      <div
        ref={drop}
        className={`render-container ${
          selectedIndex === index ? "selected" : ""
        }`}
        style={inlineStyle}
        onClick={handleClick}
      >
        {component.children?.map((child, i) => (
          <RenderComponent
            key={child.id}
            component={child}
            onDropInside={(childItem) => onDropInside(childItem, index, i)}
            onSelect={onSelect}
            selectedIndex={selectedIndex}
            index={i}
          />
        ))}
      </div>
    );
  }

  // NON-CONTAINERS: render directly without extra wrapper
  switch (component.type) {
    case "button":
      return (
        <button
          style={inlineStyle}
          className={`render-button ${
            selectedIndex === index ? "selected" : ""
          }`}
          onClick={handleClick}
        >
          {component.text || "Button"}
        </button>
      );

    case "text":
      return (
        <p
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          {component.text || "Text"}
        </p>
      );

    case "input":
      return (
        <input
          style={inlineStyle}
          className={`render-input ${
            selectedIndex === index ? "selected" : ""
          }`}
          placeholder="Input"
          onClick={handleClick}
        />
      );

    default:
      return null;
  }
};

export default RenderComponent;
