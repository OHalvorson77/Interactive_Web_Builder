import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const canvases = [
    { id: '1', name: 'Canvas 1' },
    { id: '2', name: 'Canvas 2' },
    { id: '3', name: 'Canvas 3' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {canvases.map((canvas) => (
          <div
            key={canvas.id}
            className="p-4 bg-purple-100 border rounded cursor-pointer hover:bg-purple-200 transition"
            onClick={() => navigate(`/canvas`)}
          >
            {canvas.name}
          </div>
        ))}
      </div>
    </div>
  );
}
