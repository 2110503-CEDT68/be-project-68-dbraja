import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationsPage from './pages/RegistrationsPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/registrations"
              element={
                <ProtectedRoute>
                  <RegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <AdminRoute>
                  <AdminCompaniesPage />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
