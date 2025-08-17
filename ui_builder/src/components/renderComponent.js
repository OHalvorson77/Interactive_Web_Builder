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
      if (["container", "card", "row"].includes(component.type)) {
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

  // Recursive rendering for containers / layout components
  if (["container", "card", "row"].includes(component.type)) {
    return (
      <div
        ref={drop}
        className={`render-${component.type} ${
          selectedIndex === index ? "selected" : ""
        }`}
        style={inlineStyle}
        onClick={handleClick}
      >
        {component.children?.map((child, i) => (
          <RenderComponent
            key={child.id || i}
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

  // Leaf components
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
          {component.styles?.text || "Button"}
        </button>
      );

    case "text":
      return (
        <p
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          {component.styles?.text || "Text"}
        </p>
      );

    case "heading":
      return (
        <h2
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          {component.styles?.text || "Heading"}
        </h2>
      );

    case "link":
      return (
        <a
          href={component.styles?.href || "#"}
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          {component.styles?.text || "Link"}
        </a>
      );

    case "input":
      return (
        <input
          style={inlineStyle}
          className={`render-input ${
            selectedIndex === index ? "selected" : ""
          }`}
          placeholder={component.styles?.placeholder || "Input"}
          onClick={handleClick}
        />
      );

    case "textarea":
      return (
        <textarea
          style={inlineStyle}
          className={`render-textarea ${
            selectedIndex === index ? "selected" : ""
          }`}
          placeholder={component.styles?.placeholder || "Enter text..."}
          onClick={handleClick}
        />
      );

    case "select":
      return (
        <select
          style={inlineStyle}
          className={`render-select ${
            selectedIndex === index ? "selected" : ""
          }`}
          onClick={handleClick}
        >
          {component.styles?.options?.map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <label
          style={{ display: "flex", alignItems: "center", gap: "6px", ...inlineStyle }}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          <input type="checkbox" defaultChecked={component.styles?.checked} />
          {component.styles?.label}
        </label>
      );

    case "radio":
      return (
        <label
          style={{ display: "flex", alignItems: "center", gap: "6px", ...inlineStyle }}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          <input type="radio" defaultChecked={component.styles?.selected} />
          {component.styles?.label}
        </label>
      );

    case "image":
      return (
        <img
          src={component.styles?.src}
          alt="component"
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        />
      );

    case "divider":
      return (
        <hr
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        />
      );

    case "list":
      return (
        <ul
          style={{ listStyleType: component.styles?.listStyle || "disc", ...inlineStyle }}
          className={selectedIndex === index ? "selected" : ""}
          onClick={handleClick}
        >
          {component.styles?.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "video":
      return (
        <video
          style={inlineStyle}
          className={selectedIndex === index ? "selected" : ""}
          src={component.styles?.src}
          controls={component.styles?.controls}
          autoPlay={component.styles?.autoplay}
          onClick={handleClick}
        />
      );

    default:
      return null;
  }
};

export default RenderComponent;
