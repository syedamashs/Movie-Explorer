function HomePage() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-4">🎬 Movie Explorer</h1>
            <p className="lead text-muted">Your Ultimate Movie Discovery Platform</p>
          </div>
          
          <div className="card bg-light border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="row text-center mb-5">
                <div className="col-md-4 mb-4">
                  <div className="h1 mb-3">🔍</div>
                  <h4>Search Movies</h4>
                  <p className="text-muted">Find any movie from our vast database with instant search results</p>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="h1 mb-3">⭐</div>
                  <h4>Save to Collections</h4>
                  <p className="text-muted">Build your personal movie collection and organize your favorites</p>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="h1 mb-3">📚</div>
                  <h4>Organize & Enjoy</h4>
                  <p className="text-muted">Keep track of your favorite films and discover new ones</p>
                </div>
              </div>
              
              <hr className="my-5" />
              
              <div className="text-center">
                <h3 className="mb-4">🌟 Welcome to Movie Explorer!</h3>
                <p className="text-muted mb-4">
                  Discover, search, and collect your favorite movies all in one place. 
                  Start your movie journey by clicking the Search button in the navigation.
                </p>
                <div className="alert alert-info">
                  <strong>💡 Tip:</strong> Use the navigation menu above to explore different features!
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <div className="card border-0 bg-dark text-white">
              <div className="card-body p-4">
                <h5 className="mb-3">👨‍💻 Developer</h5>
                <p className="mb-2"><strong>Syed Amash</strong></p>
                <p className="mb-2">Full Stack Developer & Movie Enthusiast</p>
                <p className="mb-0">
                  <a href="https://github.com/syedamashs" className="text-light text-decoration-none">
                    <i className="fab fa-github me-2"></i>GitHub
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 