import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md">
              <span className="text-white text-lg">✈</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-blue-700">SkyWays</span>
              <span className="hidden sm:inline text-xs font-medium text-gray-400">Airlines</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home', end: true },
              ...(isAuthenticated ? [{ to: '/my-bookings', label: 'My Bookings', end: false }] : []),
              { to: '/support', label: 'Support', end: false },
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }>{label}</NavLink>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white flex items-center justify-center text-xs font-bold shadow">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {user?.firstName}
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow hover:shadow-md transition-all"
                  style={{ background: 'linear-gradient(90deg,#2563eb,#0ea5e9)' }}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">Home</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">My Bookings</Link>
          )}
          <Link to="/support" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">Support</Link>
          <div className="pt-3 border-t border-gray-100 flex gap-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">Sign Out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: 'linear-gradient(90deg,#2563eb,#0ea5e9)' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
