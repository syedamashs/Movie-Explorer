import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import './Navigation.css';

function Navigation({ collectionsCount, user, onLogin, onRegister, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleAuthSuccess = (data) => {
    if (data.token) {
      onLogin(data);
    } else {
      onRegister(data);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {/* Hamburger Menu - Always visible */}
          <button
            className="navbar-toggler hamburger-btn"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Brand - Centered */}
          <Link className="navbar-brand mx-auto" to="/">
            🎬 Movie Explorer
          </Link>

          {/* Auth Buttons / User Profile - Right side */}
          <div className="auth-section">
            {user ? (
              <UserProfile user={user} onLogout={onLogout} />
            ) : (
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                🔐 Login / Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      
      {/* Mobile Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h5 className="mb-0">🎬 Movie Explorer</h5>
          <button 
            className="btn-close btn-close-white" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          ></button>
        </div>
        <div className="sidebar-body">
          <ul className="sidebar-nav">
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/" onClick={closeSidebar}>
                🏠 Home
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/search" onClick={closeSidebar}>
                🔍 Search
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/collections" onClick={closeSidebar}>
                📚 Collections {collectionsCount > 0 && <span className="badge bg-primary">{collectionsCount}</span>}
              </Link>
            </li>
            {user && (
              <li className="sidebar-item">
                <Link className="sidebar-link" to="/profile" onClick={closeSidebar}>
                  👤 Profile
                </Link>
              </li>
            )}
            {!user && (
              <li className="sidebar-item">
                <button 
                  className="sidebar-link auth-sidebar-btn"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    closeSidebar();
                  }}
                >
                  🔐 Login / Signup
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleAuthSuccess}
        onRegister={handleAuthSuccess}
      />
    </>
  );
}

export default Navigation; 