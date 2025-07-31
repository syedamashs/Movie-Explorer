import { useState, useEffect } from 'react';
import './Profile.css';

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, just set the user data
    setProfileData(user);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user?.displayName || 'User'}</h2>
                  <p className="profile-email">{user?.email || 'No email'}</p>
                  <p className="profile-join-date">
                    Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="row">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">🎬</div>
                      <div className="stat-label">Movie Explorer</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">⭐</div>
                      <div className="stat-label">Google Sign-In</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">📚</div>
                      <div className="stat-label">Collections</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                  <button className="btn btn-primary">
                    📚 View Collections
                  </button>
                  <button className="btn btn-outline-primary">
                    🔍 Search Movies
                  </button>
                  <button className="btn btn-outline-secondary">
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 