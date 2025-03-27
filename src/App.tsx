import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Instructors from './pages/Instructors'; 
import Courses from './pages/Courses'; 
import Students from './pages/Students';
import Revenues from './pages/Revenues';
import Expenses from './pages/Expenses';


import { AuthProvider, useAuth } from './contexts/AuthContext';
import Payments from './pages/Payments';

// ✅ Component لحماية المسارات الخاصة
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructors" 
            element={
              <ProtectedRoute>
                <Instructors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } 
            />
              <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } 
            />
          <Route 
            path="/revenues" 
            element={
              <ProtectedRoute>
                <Revenues />
              </ProtectedRoute>
            } 
            />
            
            <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } 
            />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
