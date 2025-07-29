import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-title">
                <span className="text-primary">🎬</span> Movie Explorer
              </h1>
              <p className="hero-subtitle">
                Discover, Explore, and Collect Your Favorite Films
              </p>
              <div className="hero-stats">
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3>10,000+</h3>
                      <p>Movies Available</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3>Real-time</h3>
                      <p>Search Results</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3>Personal</h3>
                      <p>Collections</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  🔍
                </div>
                <h4>Advanced Search</h4>
                <p>Find any movie instantly with our powerful search engine powered by OMDB API. Get detailed information, ratings, and cast details.</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  ⭐
                </div>
                <h4>Personal Collections</h4>
                <p>Save your favorite movies to personalized collections. Organize them by genre, mood, or any way you prefer.</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  📱
                </div>
                <h4>Responsive Design</h4>
                <p>Enjoy seamless experience across all devices. From desktop to mobile, Movie Explorer works perfectly everywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">How It Works</h2>
          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <div className="step-card">
                <div className="step-number">1</div>
                <h5>Search</h5>
                <p>Enter any movie title to find detailed information</p>
              </div>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-card">
                <div className="step-number">2</div>
                <h5>Explore</h5>
                <p>Browse through movie details, ratings, and cast</p>
              </div>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-card">
                <div className="step-number">3</div>
                <h5>Save</h5>
                <p>Add movies to your personal collection</p>
              </div>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-card">
                <div className="step-number">4</div>
                <h5>Enjoy</h5>
                <p>Access your collections anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="developer-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="developer-card">
                <div className="developer-header">
                  <div className="developer-avatar">
                    👨‍💻
                  </div>
                  <div className="developer-info">
                    <h4>Syed Amash</h4>
                    <p className="developer-title">Full Stack Developer</p>
                    <p className="developer-bio">Passionate about creating innovative web applications and exploring the latest technologies.</p>
                  </div>
                </div>
                <div className="developer-links">
                  <a href="https://github.com/syedamashs" className="btn btn-outline-primary me-2">
                    📁 GitHub
                  </a>
                  <a href="#" className="btn btn-outline-info">
                    🌐 Portfolio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 