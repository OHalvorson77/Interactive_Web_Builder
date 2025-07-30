import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import clsx from "clsx";

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

const CanvasComponent = ({ item, index, onClick, isSelected }) => {
  const baseStyle = "mb-3 p-2 rounded shadow cursor-pointer transition";
  const style = {
    width: item.width + "%",
    height: item.height + "px",
    backgroundColor: item.backgroundColor || "white",
  };

  return (
    <div
      className={clsx(baseStyle, isSelected ? "ring-2 ring-purple-500" : "")}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick(index);
      }}
    >
      {item.type === "button" && (
        <button className="px-4 py-2 bg-purple-600 text-white rounded w-full h-full">
          Button
        </button>
      )}
      {item.type === "text" && (
        <p className="text-purple-800 font-medium">Sample Text</p>
      )}
      {item.type === "input" && (
        <input
          type="text"
          className="border border-purple-300 px-2 py-1 rounded w-full"
          placeholder="Input field"
        />
      )}
      {item.type === "container" && (
        <div className="border border-dashed border-purple-400 h-full w-full flex items-center justify-center text-purple-400">
          Container
        </div>
      )}
    </div>
  );
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
      {droppedComponents.map((item, index) => (
        <CanvasComponent
          key={index}
          item={item}
          index={index}
          onClick={onSelect}
          isSelected={index === selectedIndex}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDrop = (component) => {
    setDroppedComponents((prev) => [
      ...prev,
      {
        ...component,
        width: 100,
        height: 100,
        backgroundColor: "#ffffff",
      },
    ]);
  };

  const updateSelectedComponent = (updates) => {
    if (selectedIndex === null) return;
    setDroppedComponents((prev) =>
      prev.map((item, i) =>
        i === selectedIndex ? { ...item, ...updates } : item
      )
    );
  };

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
                </>
              )}

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
