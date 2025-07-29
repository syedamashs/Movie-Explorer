import { useState } from 'react';
import { Link } from 'react-router-dom';
import './UserProfile.css';

function UserProfile({ user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="user-profile">
      <button className="profile-btn" onClick={toggleDropdown}>
        <div className="profile-avatar">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="profile-name">{user.username}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-username">{user.username}</div>
              <div className="dropdown-email">{user.email}</div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <Link 
            to="/profile" 
            className="dropdown-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            👤 View Profile
          </Link>
          
          <Link 
            to="/collections" 
            className="dropdown-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            📚 My Collections
          </Link>
          
          <div className="dropdown-divider"></div>
          
          <button className="dropdown-item logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
      )}
    </div>
  );
}

export default UserProfile; 