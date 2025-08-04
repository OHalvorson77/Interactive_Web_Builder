import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuid } from 'uuid';

const COMPONENTS = [
  { type: "button", label: "Button" },
  { type: "text", label: "Text" },
  { type: "input", label: "Input" },
  { type: "container", label: "Container" },
];

const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { component },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className="w-16 h-16 m-2 flex items-center justify-center border border-purple-300 rounded-md cursor-move bg-white shadow hover:bg-purple-100 transition text-xs text-center"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {component.label}
    </div>
  );
};

const RenderComponent = ({
  component,
  onDropInside,
  onSelect,
  selectedIndex,
  index,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => {
      if (component.type === "container") {
        onDropInside(component.id, item.component);
      }
    },
    canDrop: () => component.type === "container",
  }));

  const isSelected = selectedIndex === index;

  const wrapperStyle = {
    display: 'inline-block',
    width: `${component.width}%`,
    height: `${component.height}px`,
    backgroundColor: component.backgroundColor || "#fff",
    outline: isSelected ? "2px solid #9333ea" : "none",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(index);
  };

  if (component.type === "container") {
    return (
      <div
        ref={drop}
        className={`p-2 m-2 border border-purple-300 bg-gray-100 rounded ${
          isSelected ? "ring-2 ring-purple-500" : ""
        }`}
        style={wrapperStyle}
        onClick={handleClick}
      >
        {component.children?.map((child, i) => (
          <RenderComponent
            key={child.id}
            component={child}
            onDropInside={onDropInside}
            onSelect={onSelect}
            selectedIndex={selectedIndex}
            index={i}
          />
        ))}
      </div>
    );
  }

  return (
    <span style={wrapperStyle} onClick={handleClick}>
      {component.type === "button" && (
        
    <button
      onClick={handleClick}
      style={{
        width: `${component.width}%`,
        height: `${component.height}px`,
        backgroundColor: component.backgroundColor,
        color: component.color,
        fontSize: `${component.fontSize}px`,
        borderRadius: `${component.borderRadius}px`,
        padding: `${component.padding}px`,
        boxShadow: component.shadow ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
      }}
      className="hover:brightness-105 transition"
    >
      {component.text}
    </button>
      )}
      {component.type === "text" && (
        <p
      onClick={handleClick}
      style={{
        width: `${component.width}%`,
        height: `${component.height}px`,
        backgroundColor: component.backgroundColor,
        fontSize: `${component.fontSize}px`,
        fontWeight: component.fontWeight,
        color: component.color,
        textAlign: component.textAlign,
      }}
    >
      {component.text}
    </p>
      )}
      {component.type === "input" && (
        <input
          className="w-full h-full border px-2 py-1 rounded"
          placeholder="Input"
        />
      )}
    </span>
  );
};






export default function CanvasEditorPage() {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

 const handleDrop = (component) => {
  const base = {
    id: uuid(),
    width: 100,
    height: 100,
    backgroundColor: "#ffffff",
  };

  switch (component.type) {
    case "button":
      setDroppedComponents((prev) => [
        ...prev,
        { ...base, ...component, text: "Button", fontSize: 16, color: "#ffffff", borderRadius: 6, shadow: true, padding: 10 },
      ]);
      break;
    case "text":
      setDroppedComponents((prev) => [
        ...prev,
        { ...base, ...component, text: "Sample Text", fontSize: 16, fontWeight: "normal", color: "#4c1d95", textAlign: "left" },
      ]);
      break;
    case "input":
      setDroppedComponents((prev) => [
        ...prev,
        { ...base, ...component, placeholder: "Enter text", fontSize: 16, borderColor: "#d1d5db" },
      ]);
      break;
    case "container":
      setDroppedComponents((prev) => [
        ...prev,
        {
          ...base,
          ...component,
          children: [],
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          gap: 8,
          padding: 10,
        },
      ]);
      break;
  }
};

  const DroppableCanvas = ({
  droppedComponents,
  onDrop,
  onSelect,
  selectedIndex,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => onDrop(item.component),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 min-h-[500px] border-2 border-dashed border-purple-300 bg-gray-50 p-4 rounded overflow-y-auto"
      onClick={() => onSelect(null)}
    >
      {droppedComponents.map((comp, i) => (
        <RenderComponent
          key={comp.id}
          component={comp}
          onDropInside={handleDropInsideContainer}
          onSelect={onSelect}
          selectedIndex={selectedIndex}
          index={i}
        />
      ))}
    </div>
  );
};


  const updateSelectedComponent = (updates) => {
    if (selectedIndex === null) return;
    setDroppedComponents((prev) =>
      prev.map((item, i) =>
        i === selectedIndex ? { ...item, ...updates } : item
      )
    );
  };

const handleDropInsideContainer = (containerId, newComponent) => {
  const addToContainer = (components) =>
    components.map((comp) => {
      if (comp.id === containerId && comp.type === 'container') {
        const base = {
          id: uuid(),
          width: 100,
          height: 100,
          backgroundColor: "#ffffff",
        };

        let initializedComponent = {};

        switch (newComponent.type) {
          case "button":
            initializedComponent = {
              ...base,
              ...newComponent,
              text: "Button",
              fontSize: 16,
              color: "#ffffff",
              borderRadius: 6,
              shadow: true,
              padding: 10,
            };
            break;
          case "text":
            initializedComponent = {
              ...base,
              ...newComponent,
              text: "Sample Text",
              fontSize: 16,
              fontWeight: "normal",
              color: "#4c1d95",
              textAlign: "left",
            };
            break;
          case "input":
            initializedComponent = {
              ...base,
              ...newComponent,
              placeholder: "Enter text",
              fontSize: 16,
              borderColor: "#d1d5db",
            };
            break;
          case "container":
            initializedComponent = {
              ...base,
              ...newComponent,
              children: [],
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "stretch",
              gap: 8,
              padding: 10,
            };
            break;
          default:
            return comp;
        }

        return {
          ...comp,
          children: [...(comp.children || []), initializedComponent],
        };
      }

      // Recursively handle nested containers
      if (comp.children) {
        return {
          ...comp,
          children: addToContainer(comp.children),
        };
      }

      return comp;
    });

  setDroppedComponents((prev) => addToContainer(prev));
};

const handleSave = async () => {
  try {
    const res = await fetch("http://localhost:3001/page/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components: droppedComponents }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Page saved successfully! ID: " + data.id);
    } else {
      alert("Failed to save page");
    }
  } catch (err) {
    console.error("Save failed:", err);
    alert("Error saving page.");
  }
};


  const selectedComponent = droppedComponents[selectedIndex];


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100 relative">
        {showSidebar && (
          <div className="w-1/4 bg-purple-100 p-4 border-r border-purple-300 relative overflow-y-auto">
            <h2 className="font-bold text-purple-800 text-lg mb-4">
              {selectedIndex === null ? "Components" : "Inspector"}
            </h2>

            {selectedIndex === null
              ? COMPONENTS.map((comp) => (
                  <DraggableComponent key={comp.type} component={comp} />
                ))
              : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Width (%)
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={droppedComponents[selectedIndex].width}
                      onChange={(e) =>
                        updateSelectedComponent({ width: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={500}
                      value={droppedComponents[selectedIndex].height}
                      onChange={(e) =>
                        updateSelectedComponent({ height: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={droppedComponents[selectedIndex].backgroundColor}
                      onChange={(e) =>
                        updateSelectedComponent({ backgroundColor: e.target.value })
                      }
                      className="w-full h-10 p-1 rounded"
                    />
                  </div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Text</label>
    <input
      className="mb-2 p-1 w-full"
      value={selectedComponent.text}
      onChange={(e) => updateSelectedComponent({ text: e.target.value })}
    />

    <label className="block text-sm font-medium text-purple-700 mb-1">Font Size</label>
    <input
      type="number"
      className="mb-2 p-1 w-full"
      value={selectedComponent.fontSize}
      onChange={(e) => updateSelectedComponent({ fontSize: Number(e.target.value) })}
    />

    <label className="block text-sm font-medium text-purple-700 mb-1">Text Color</label>
    <input
      type="color"
      className="mb-2 w-full h-8"
      value={selectedComponent.color}
      onChange={(e) => updateSelectedComponent({ color: e.target.value })}
    />

    <label className="block text-sm font-medium text-purple-700 mb-1">Border Radius</label>
    <input
      type="range"
      min={0}
      max={50}
      value={selectedComponent.borderRadius}
      onChange={(e) => updateSelectedComponent({ borderRadius: Number(e.target.value) })}
    />

    <label className="block text-sm font-medium text-purple-700 mb-1">Shadow</label>
    <input
      type="checkbox"
      checked={selectedComponent.shadow}
      onChange={(e) => updateSelectedComponent({ shadow: e.target.checked })}
    />
  </>
              )}

            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 -right-3 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow"
            >
              &lt;
            </button>
            <button
  onClick={handleSave}
  className="mb-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
>
  Save Page
</button>
          </div>
        )}

        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-0 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow z-50"
          >
            &gt;
          </button>
        )}

        <div className="flex-1 p-6">
      
          <DroppableCanvas
            droppedComponents={droppedComponents}
            onDrop={handleDrop}
            onSelect={setSelectedIndex}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </DndProvider>
  );
}
