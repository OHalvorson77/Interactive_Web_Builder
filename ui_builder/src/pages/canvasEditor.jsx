import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuid } from "uuid";

import DraggableComponent from "../components/draggableComponent";
import DroppableCanvas from "../components/droppableCanvas";
import { COMPONENTS } from "../data/COMPONENTS";
import ComponentInspector from "../components/componentInspector";


const CanvasEditorPage = () => {
  const [components, setComponents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
 

  const handleDrop = (item) => {
    const newItem = { ...item, id: uuid() };
    if (newItem.type === "container") newItem.children = [];
    setComponents((prev) => [...prev, newItem]);
  };

  const handleDropInside = (item, parentIndex, childIndex = null) => {
    const newItem = { ...item, id: uuid() };
    setComponents((prev) =>
      prev.map((comp, index) => {
        if (index === parentIndex && comp.type === "container") {
          const children = [...(comp.children || [])];
          if (childIndex !== null) {
            children.splice(childIndex, 0, newItem);
          } else {
            children.push(newItem);
          }
          return { ...comp, children };
        }
        return comp;
      })
    );
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-4 min-h-screen">
        <div className="col-span-1 p-4 bg-gray-50 border-r flex flex-col overflow-y-auto">
          {showSidebar && (
            <div className="relative">
              <div>
                <h2 className="text-lg font-bold mb-2">Components</h2>
                {COMPONENTS.map((component, i) => (
                  <DraggableComponent key={i} component={component} />
                ))}
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">Editor</h2>
                <ComponentInspector
                  component={components[selectedIndex]}
                  onChange={(updatedComponent) => {
                    setComponents((prev) =>
                      prev.map((comp, i) =>
                        i === selectedIndex ? updatedComponent : comp
                      )
                    );
                  }}
                />
              </div>

              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 -right-3 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow"
              >
                &lt;
              </button>
            </div>
          )}
        </div>

        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-0 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-sm rounded-r shadow z-50"
          >
            &gt;
          </button>
        )}

        <div className="col-span-3 p-4">
          <DroppableCanvas
            components={components}
            onDrop={handleDrop}
            onDropInside={handleDropInside}
            onSelect={handleSelect}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </DndProvider>
  
  );
};

export default CanvasEditorPage;
