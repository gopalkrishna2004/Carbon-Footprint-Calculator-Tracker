import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Don't show sidebar on login/register pages
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">Carbon Tracker</span>
        </div>
        <div className="mobile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleLinkClick}>
            <span className="logo-icon">🌍</span>
            <span className="logo-text">Carbon Tracker</span>
          </Link>
        </div>
        
        <div className="sidebar-menu">
          <Link 
            to="/dashboard" 
            className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="link-icon">📊</span>
            <span className="link-text">Dashboard</span>
          </Link>
          
          <Link 
            to="/activities" 
            className={`sidebar-link ${isActive('/activities') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span className="link-icon">📝</span>
            <span className="link-text">Activities</span>
          </Link>
          
        <Link 
          to="/profile" 
          className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <span className="link-icon">👤</span>
          <span className="link-text">Profile</span>
        </Link>

        <Link 
          to="/ai-recommendations" 
          className={`sidebar-link ${isActive('/ai-recommendations') ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <span className="link-icon">🤖</span>
          <span className="link-text">AI Assistant</span>
        </Link>
      </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="link-icon">🚪</span>
            <span className="link-text">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
