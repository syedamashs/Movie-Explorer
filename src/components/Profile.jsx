import { useState, useEffect } from 'react';
import './Profile.css';

// API URL - will be different for production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://movie-explorer-backend-5aq3.onrender.com' 
  : 'http://localhost:5000';

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
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
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user.username}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-join-date">
                    Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="row">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">{profileData?.collections?.length || 0}</div>
                      <div className="stat-label">Movies in Collection</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">
                        {profileData?.createdAt ? 
                          Math.floor((new Date() - new Date(profileData.createdAt)) / (1000 * 60 * 60 * 24)) : 0
                        }
                      </div>
                      <div className="stat-label">Days as Member</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <div className="stat-number">🎬</div>
                      <div className="stat-label">Movie Explorer</div>
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