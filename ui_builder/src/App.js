import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CanvasEditorPage from './pages/canvasEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/canvas" element={<CanvasEditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
