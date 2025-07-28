import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const COMPONENTS = [
  { type: "button", label: "Button" },
  { type: "text", label: "Text" },
  { type: "input", label: "Input" },
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
      className="p-2 m-2 border rounded cursor-move bg-white shadow"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {component.label}
    </div>
  );
};

const DroppableCanvas = ({ droppedComponents, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => onDrop(item.component),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 min-h-[500px] border border-dashed border-gray-400 bg-gray-50 p-4"
    >
      {droppedComponents.map((item, index) => (
        <div key={index} className="mb-2">
          {item.type === "button" && <button className="px-4 py-2 bg-blue-500 text-white rounded">Button</button>}
          {item.type === "text" && <p className="text-gray-700">Sample Text</p>}
          {item.type === "input" && <input type="text" className="border px-2 py-1 rounded w-full" placeholder="Input field" />}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [droppedComponents, setDroppedComponents] = useState([]);

  const handleDrop = (component) => {
    setDroppedComponents((prev) => [...prev, component]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <div className="w-1/4 bg-gray-100 p-4 border-r">
          <h2 className="font-bold mb-4">Components</h2>
          {COMPONENTS.map((comp) => (
            <DraggableComponent key={comp.type} component={comp} />
          ))}
        </div>

        <div className="flex-1 p-4">
          <h2 className="font-bold mb-2">Canvas</h2>
          <DroppableCanvas
            droppedComponents={droppedComponents}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </DndProvider>
  );
}
