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

const RenderComponent = ({ component, onDropInside, onSelect, selectedIndex, index }) => {
  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => {
      if (component.type === 'container') {
        onDropInside(component.id, item.component);
      }
    },
    canDrop: () => component.type === 'container',
  }));

  const isSelected = selectedIndex === index;

  return (
    <div
      ref={component.type === 'container' ? drop : null}
      className={`p-2 m-2 ${component.type === 'container' ? 'border border-purple-300 bg-gray-100 rounded' : ''} ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
      style={{
        width: `${component.width}%`,
        height: `${component.height}px`,
        backgroundColor: component.backgroundColor || "#fff",
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent deselection from canvas click
        onSelect(index);
      }}
    >
      {component.type === 'button' && (
        <button className="px-4 py-2 bg-purple-600 text-white rounded shadow">Button</button>
      )}
      {component.type === 'text' && <p className="text-purple-800">Sample Text</p>}
      {component.type === 'input' && <input className="border px-2 py-1 rounded w-full" placeholder="Input" />}
      {component.type === 'container' &&
        component.children?.map((child, i) => (
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
};



export default function CanvasEditorPage() {
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
        return {
          ...comp,
          children: [
            ...(comp.children || []),
            { ...newComponent, id: uuid(), children: newComponent.type === 'container' ? [] : undefined },
          ],
        };
      }
      if (comp.children) {
        return { ...comp, children: addToContainer(comp.children) };
      }
      return comp;
    });

  setDroppedComponents((prev) => addToContainer(prev));
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
