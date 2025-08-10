import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuid } from "uuid";

import DraggableComponent from "../components/draggableComponent";
import DroppableCanvas from "../components/droppableCanvas";
import { COMPONENTS } from "../data/COMPONENTS";
import ComponentInspector from "../components/componentInspector";

import "../styles/pages/CanvasEditorPage.css";
import "../styles/components/DraggableComponent.css";

const CanvasEditorPage = () => {
  const [components, setComponents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const pageId = "home"; // change this dynamically if needed

  useEffect(() => {
    fetch(`http://localhost:3000/api/page/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page");
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setComponents(data.components || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pageId]);

  const savePage = () => {
    fetch(`http://localhost:5000/api/page/${pageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Saved page:", data);
      })
      .catch((err) => {
        console.error("Error saving page:", err);
      });
  };

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
      <div className="container-grid">
        <div className="sidebar">
          {showSidebar && (
            <div className="relative">
              <div>
                <h2>Components</h2>

                <div className="draggable-components-grid">
                  {COMPONENTS.map((component, i) => (
                    <DraggableComponent key={i} component={component} />
                  ))}
                </div>
              </div>

              <hr />

              <div className="editor-section">
                <h2>Editor</h2>
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

              <button onClick={savePage} className="save-button">
                Save Page
              </button>

              <button
                onClick={() => setShowSidebar(false)}
                className="toggle-button"
                aria-label="Close sidebar"
              >
                &lt;
              </button>
            </div>
          )}
        </div>

        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="toggle-button-left"
            aria-label="Open sidebar"
          >
            &gt;
          </button>
        )}

        <div className="main-canvas">
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
