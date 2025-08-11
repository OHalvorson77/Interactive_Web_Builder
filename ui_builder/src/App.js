import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import CanvasEditorPage from './pages/canvasEditor';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/signupPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/canvas" element={<CanvasEditorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />


      </Routes>
    </Router>
  );
}

export default App;
