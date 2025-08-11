import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const canvases = [
    { id: "1", name: "Canvas 1" },
    { id: "2", name: "Canvas 2" },
    { id: "3", name: "Canvas 3" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎨 My Canvases</h1>
        <button
          className="new-canvas-btn"
          onClick={() => navigate("/canvas")}
        >
          + Create New Canvas
        </button>
      </header>

      <div className="canvas-grid">
        {canvases.map((canvas) => (
          <div
            key={canvas.id}
            className="canvas-card"
            onClick={() => navigate(`/canvas/${canvas.id}`)}
          >
            <div className="canvas-thumbnail">
              <span className="canvas-icon">🖌️</span>
            </div>
            <h2>{canvas.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
