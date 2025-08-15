import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch canvases from backend on mount
  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/canvases", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use JWT
          },
        });
        const data = await res.json();
        setCanvases(data);
      } catch (err) {
        console.error("Error fetching canvases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanvases();
  }, []);

  // Create new canvas in backend
  const handleCreateCanvas = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/canvases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: "Untitled Canvas" }),
      });
      const newCanvas = await res.json();
      navigate(`/canvas/${newCanvas.id}`);
    } catch (err) {
      console.error("Error creating canvas:", err);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎨 My Canvases</h1>
        <button
          className="new-canvas-btn"
          onClick={handleCreateCanvas}
        >
          + Create New Canvas
        </button>
      </header>

      {canvases.length === 0 ? (
        <p>No canvases yet. Create one to get started!</p>
      ) : (
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
      )}
    </div>
  );
}
