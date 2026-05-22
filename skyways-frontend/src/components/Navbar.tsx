import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">✈</span>
            <span className="text-xl font-bold text-brand-700">SkyWays</span>
            <span className="hidden sm:inline text-sm text-gray-500 font-medium">Airlines</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`
            }>Home</NavLink>
            <NavLink to="/search" className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`
            }>Search Flights</NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`
              }>My Bookings</NavLink>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                  <span>{user?.firstName}</span>
                </NavLink>
                <button onClick={handleLogout} className="btn-secondary py-1.5 px-4 text-xs">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-xs">Sign In</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-xs">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <span className="text-xl">✕</span>
              : <span className="text-xl">☰</span>
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Home</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Search Flights</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">My Bookings</Link>
          )}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 px-3">Sign Out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-xs py-1.5 px-3">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-xs py-1.5 px-3">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
