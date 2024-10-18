import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import TestPlans from './pages/TestPlans';
import TestCases from './pages/TestCases';
import Defects from './pages/Defects';
import TestExecution from './pages/TestExecution';
import Metrics from './pages/Metrics';
import Login from './pages/Login';
import Register from './pages/Register'; // Importamos la página de registro
import PrivateRoute from './components/PrivateRoute'; // Ruta protegida

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Control de autenticación

  return (
    <Router>
      {isAuthenticated && <Navbar />} {/* Solo mostrar el Navbar si está autenticado */}
      <Routes>
        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Projects />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/test-plans" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TestPlans />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/test-cases" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TestCases />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/defects" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Defects />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/test_execution" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TestExecution />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/metrics" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Metrics />
            </PrivateRoute>
          } 
        />
        
        {/* Rutas sin protección */}
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
