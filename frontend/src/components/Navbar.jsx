import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
          Job Fair 2022
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-200 text-sm font-medium">Companies</Link>
          {user ? (
            <>
              <Link to="/registrations" className="hover:text-blue-200 text-sm font-medium">
                My Registrations
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/companies" className="hover:text-blue-200 text-sm font-medium">
                  Admin
                </Link>
              )}
              <span className="text-blue-200 text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded hover:bg-blue-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 text-sm font-medium">Login</Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
