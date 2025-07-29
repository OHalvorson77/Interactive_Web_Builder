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
      className="w-16 h-16 flex items-center justify-center m-2 border border-purple-400 rounded bg-white hover:bg-purple-100 cursor-move shadow-sm transition"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="text-purple-700 text-sm text-center font-medium">{component.label}</span>
    </div>
  );
};

const DroppableCanvas = ({ droppedComponents, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => onDrop(item.component),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 min-h-[500px] border-2 border-dashed border-purple-300 bg-gray-50 p-4 rounded"
    >
      {droppedComponents.map((item, index) => (
        <div key={index} className="mb-3">
          {item.type === "button" && (
            <button className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition">
              Button
            </button>
          )}
          {item.type === "text" && (
            <p className="text-purple-800 font-medium">Sample Text</p>
          )}
          {item.type === "input" && (
            <input
              type="text"
              className="border border-purple-300 px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Input field"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleDrop = (component) => {
    setDroppedComponents((prev) => [...prev, component]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100 relative">
        {showSidebar && (
          <div className="w-64 bg-purple-50 p-4 border-r border-purple-300 relative flex flex-col">
            <h2 className="font-bold text-purple-800 text-lg mb-4">Components</h2>
            <div className="flex flex-wrap">
              {COMPONENTS.map((comp) => (
                <DraggableComponent key={comp.type} component={comp} />
              ))}
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 -right-3 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow"
            >
              &lt;
            </button>
          </div>
        )}

        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-0 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow z-10"
          >
            &gt;
          </button>
        )}

        <div className="flex-1 p-6 overflow-auto">
          <DroppableCanvas
            droppedComponents={droppedComponents}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </DndProvider>
  );
}
