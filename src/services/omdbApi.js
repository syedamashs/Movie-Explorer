const API_KEY = '7db3fc35';
const BASE_URL = 'https://www.omdbapi.com/';

// Cache responses to optimize performance and prevent rate limiting
const cache = new Map();

export async function searchMovies({ query, page = 1, type = '', year = '' }) {
  if (!query || !query.trim()) return { Search: [], totalResults: 0, Response: "False" };

  const cacheKey = `search_${query.trim().toLowerCase()}_p${page}_t${type}_y${year}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&page=${page}`;
  if (type) url += `&type=${encodeURIComponent(type)}`;
  if (year) url += `&y=${encodeURIComponent(year)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === 'True') {
      const result = {
        Search: data.Search || [],
        totalResults: parseInt(data.totalResults || '0', 10),
        Response: 'True'
      };
      cache.set(cacheKey, result);
      return result;
    } else {
      return { Search: [], totalResults: 0, Response: 'False', Error: data.Error || 'No movies found' };
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { Search: [], totalResults: 0, Response: 'False', Error: error.message };
  }
}

export async function getMovieDetails(imdbID) {
  if (!imdbID) return null;
  const cacheKey = `movie_${imdbID}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === 'True') {
      cache.set(cacheKey, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching movie details for ${imdbID}:`, error);
    return null;
  }
}

// Curated collections with high quality IMDb IDs so the home feed is instantly rich and loaded
export const CURATED_COLLECTIONS = [
  {
    id: 'trending',
    title: '🔥 Trending & Blockbusters',
    subtitle: 'Hot releases and cinematic marvels making waves',
    imdbIDs: [
      'tt15239678', // Dune: Part Two
      'tt15398776', // Oppenheimer
      'tt0816692',  // Interstellar
      'tt1877830',  // The Batman
      'tt9362722',  // Spider-Man: Across the Spider-Verse
      'tt1375666',  // Inception
      'tt1745960',  // Top Gun: Maverick
      'tt9603212',  // Mission: Impossible - Dead Reckoning
    ]
  },
  {
    id: 'classics',
    title: '🏆 All-Time IMDb Masterpieces',
    subtitle: 'Critically acclaimed films that defined cinema history',
    imdbIDs: [
      'tt0111161', // The Shawshank Redemption
      'tt0068646', // The Godfather
      'tt0468569', // The Dark Knight
      'tt0110912', // Pulp Fiction
      'tt0137523', // Fight Club
      'tt0109830', // Forrest Gump
      'tt0133093', // The Matrix
      'tt0245429', // Spirited Away
    ]
  },
  {
    id: 'scifi',
    title: '🚀 Mind-Bending Sci-Fi',
    subtitle: 'Explore the limits of time, space, and consciousness',
    imdbIDs: [
      'tt1856101', // Blade Runner 2049
      'tt2543164', // Arrival
      'tt6723592', // Tenet
      'tt2872718', // Nightcrawler
      'tt0470752', // Ex Machina
      'tt1130884', // Shutter Island
      'tt0816692', // Interstellar
      'tt0133093', // The Matrix
    ]
  },
  {
    id: 'series',
    title: '📺 Binge-Worthy TV Series',
    subtitle: 'Gripping episodic adventures worth every second',
    imdbIDs: [
      'tt0903747', // Breaking Bad
      'tt4574334', // Stranger Things
      'tt0944947', // Game of Thrones
      'tt7660850', // Succession
      'tt3581920', // The Last of Us
      'tt8772298', // Euphoria
      'tt11126994',// Arcane
      'tt11280740',// Severance
    ]
  }
];

// Featured Spotlight Movie for Hero Banner
export const FEATURED_HERO_ID = 'tt15239678'; // Dune: Part Two
