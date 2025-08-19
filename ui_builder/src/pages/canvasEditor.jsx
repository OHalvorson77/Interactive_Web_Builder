import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";

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
  const [showComponentsSection, setShowComponentsSection] = useState(true);
  const [showEditorSection, setShowEditorSection] = useState(true);

  const { id } = useParams();
  const [pageId, setPageId] = useState(id || "unknown");

  useEffect(() => {
    fetch(`http://localhost:5000/api/page/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load page");
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
    const newPageId = pageId || uuid();
    setPageId(newPageId);

    fetch(`http://localhost:5000/api/page/${newPageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Saved page:", data);
        alert("Page successfully saved!");
      })
      .catch((err) => {
        alert("Error saving page: " + err.message);
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
        {/* Sidebar */}
        {showSidebar && (
          <div className="sidebar">
            <div className="sidebar-inner">
              {/* Components Section */}
              <div className="sidebar-section">
                <div className="section-header">
                  <h2>Components</h2>
                  <button
                    onClick={() => setShowComponentsSection((prev) => !prev)}
                    className="section-toggle"
                  >
                    {showComponentsSection ? "▼" : "▶"}
                  </button>
                </div>
                {showComponentsSection && (
                  <div className="draggable-components-grid">
                    {COMPONENTS.map((component, i) => (
                      <DraggableComponent key={i} component={component} />
                    ))}
                  </div>
                )}
              </div>

              <hr className="section-divider" />

              {/* Editor Section */}
              <div className="sidebar-section">
                <div className="section-header">
                  <h2>Editor</h2>
                  <button
                    onClick={() => setShowEditorSection((prev) => !prev)}
                    className="section-toggle"
                  >
                    {showEditorSection ? "▼" : "▶"}
                  </button>
                </div>
                {showEditorSection && (
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
                )}
              </div>

              <hr className="section-divider" />

              {/* Save Button */}
              <div className="sidebar-actions">
                <button onClick={savePage} className="save-button">
                  Save Page
                </button>
              </div>

              {/* Sidebar Close */}
              <button
                onClick={() => setShowSidebar(false)}
                className="toggle-button"
                aria-label="Close sidebar"
              >
                &lt;
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Open Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="toggle-button-left"
            aria-label="Open sidebar"
          >
            &gt;
          </button>
        )}

        {/* Canvas */}
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
