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

  // We merge inline styles for dynamic styles from component.styles
  // Outline for isOver handled by CSS below is replaced by inline outline here
  const inlineStyle = {
    ...component.styles,
    outline: isOver ? "2px dashed #a78bfa" : "none",
  };

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

  return (
    <div
      ref={drop}
      className={`render-container non-container ${
        selectedIndex === index ? "selected" : ""
      }`}
      style={inlineStyle}
      onClick={handleClick}
    >
      {component.type === "button" && (
        <button className="render-button">{component.text || "Button"}</button>
      )}
      {component.type === "text" && <p>{component.text || "Text"}</p>}
      {component.type === "input" && (
        <input className="render-input" placeholder="Input" />
      )}
    </div>
  );
};

export default RenderComponent;
