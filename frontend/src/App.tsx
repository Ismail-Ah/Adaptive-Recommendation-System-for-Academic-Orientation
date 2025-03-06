import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { UserManagement } from './pages/UserManagement';
import { UserProfile } from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <AuthGuard requiredRole="admin">
                <UserManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard requiredRole="user">
                <UserProfile />
              </AuthGuard>
            }
          />
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="mt-2 text-lg text-gray-600">Page non trouvée</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;