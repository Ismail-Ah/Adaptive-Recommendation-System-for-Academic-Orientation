import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import About from './pages/About';
import {AdminDashboard} from './components/Admin/AdminDashboard'; // ✅ Import AdminDashboard page
import { AdminLayout } from './components/Layout/AdminLayout';
import { CSVUpload } from './components/Admin/CSVUpload';
import { DiplomaForm } from './components/Admin/DiplomaForm'; // ✅ Import DiplomaForm page
import { DiplomaStatistics } from './components/Admin/DiplomaStatistics';

import AdminDiplomas from './pages/AdminDiplomas';
import MyDiplomas from './pages/MyDiplomas';

import { ThemeProvider } from './contexts/ThemeContext';




function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />; // 🚫 If not admin, redirect to home
  }

  return <>{children}</>;
}

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Fixed Navbar */}
            <Navbar className="fixed top-0 left-0 right-0 z-50" />


          {/* Main content with padding to account for the fixed Navbar */}
          <div className="pt-16">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />

            {/* Authenticated User Layout */}
            <Route
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/my-diplomas" element={<MyDiplomas />} />
            </Route>

            {/* Admin Layout */}
            <Route
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/csv-upload" element={<CSVUpload />} />
              <Route path="/DiplomaForm" element={<DiplomaForm />} />
              <Route path="/DiplomaStatistics" element={<DiplomaStatistics />} />
              <Route path="/admin-diplomas" element={<AdminDiplomas />} />
            </Route>
          </Routes>


          </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
