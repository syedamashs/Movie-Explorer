// TMDB API Service
// Fully replaces OMDb with TMDB API v3

const API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'c45a857c193f6302f2b5061c3b85e743';

// Use local Vite proxy when in dev to bypass ISP/DNS blocks, or direct TMDB API
const IS_DEV = import.meta.env?.DEV;
const BASE_URL = IS_DEV ? '/tmdb-proxy/3' : 'https://api.themoviedb.org/3';
const FALLBACK_DIRECT_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// TMDB Genre Map for instant lookups
export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

// Popular curated genres for one-click quick filtering
export const POPULAR_GENRES = [
  { id: 28, name: 'Action', emoji: '💥' },
  { id: 878, name: 'Sci-Fi', emoji: '🚀' },
  { id: 18, name: 'Drama', emoji: '🎭' },
  { id: 35, name: 'Comedy', emoji: '😂' },
  { id: 27, name: 'Horror', emoji: '👻' },
  { id: 53, name: 'Thriller', emoji: '⚡' },
  { id: 16, name: 'Animation', emoji: '✨' },
  { id: 14, name: 'Fantasy', emoji: '🧙‍♂️' },
  { id: 80, name: 'Crime', emoji: '🕵️' },
  { id: 10749, name: 'Romance', emoji: '💖' },
];

// Supported Cinema Languages for Exploring by Language (Tamil by default)
export const LANGUAGES = [
  { code: 'ta', name: 'Tamil', emoji: '🔥' },
  { code: 'all', name: 'All Languages', emoji: '🌐' },
  { code: 'te', name: 'Telugu', emoji: '⚡' },
  { code: 'ml', name: 'Malayalam', emoji: '🌴' },
  { code: 'hi', name: 'Hindi', emoji: '🎬' },
  { code: 'en', name: 'English', emoji: '🍿' },
  { code: 'ko', name: 'Korean', emoji: '✨' },
  { code: 'ja', name: 'Japanese', emoji: '🎌' },
];

const cache = new Map();

// Helper to get poster URLs
export function getPosterUrl(path, size = 'w500') {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23181e29%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23888%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fsvg%3E';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Helper to get high-resolution backdrop URLs
export function getBackdropUrl(path, size = 'original') {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Helper to get cast/crew profile photos
export function getProfileUrl(path, size = 'w185') {
  if (!path) {
    return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22185%22%20height%3D%22278%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20185%20278%22%3E%3Crect%20width%3D%22185%22%20height%3D%22278%22%20fill%3D%22%23232a3b%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23aaa%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Photo%3C%2Ftext%3E%3C%2Fsvg%3E';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Format minutes to "2h 45m"
export function formatRuntime(minutes) {
  if (!minutes || typeof minutes !== 'number') return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

// Format numbers like $150,000,000
export function formatCurrency(amount) {
  if (!amount || amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Standardize any TMDB raw result to fit app components seamlessly
export function normalizeMovie(item, defaultType = 'movie') {
  if (!item) return null;
  const isTV = item.media_type === 'tv' || (!item.title && !!item.name) || defaultType === 'tv';
  const title = item.title || item.name || 'Untitled';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A';
  
  // Resolve genres
  let genreNames = [];
  if (Array.isArray(item.genres) && item.genres.length > 0) {
    genreNames = item.genres.map((g) => g.name);
  } else if (Array.isArray(item.genre_ids)) {
    genreNames = item.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean);
  }

  // Extract key crew (director, writer)
  const director = item.credits?.crew?.find(
    (c) => c.job === 'Director' || c.department === 'Directing'
  )?.name || 'N/A';

  const writers = item.credits?.crew
    ?.filter((c) => c.job === 'Screenplay' || c.job === 'Writer')
    ?.map((c) => c.name)
    ?.slice(0, 3)
    ?.join(', ') || 'N/A';

  const actors = item.credits?.cast
    ?.slice(0, 6)
    ?.map((a) => a.name)
    ?.join(', ') || 'N/A';

  // Find official trailer if videos included
  const officialTrailer = item.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  ) || item.videos?.results?.[0];

  return {
    // Unique Identification
    id: item.id,
    imdbID: item.imdb_id || `tmdb_${item.id}`,
    tmdbId: item.id,
    media_type: isTV ? 'tv' : 'movie',
    Type: isTV ? 'series' : 'movie',

    // Titles
    title,
    Title: title,
    original_title: item.original_title || item.original_name || title,
    tagline: item.tagline || '',

    // Artwork
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    Poster: getPosterUrl(item.poster_path, 'w500'),
    Backdrop: getBackdropUrl(item.backdrop_path, 'original'),
    backdrop_w1280: getBackdropUrl(item.backdrop_path, 'w1280'),

    // Dates & Duration
    release_date: releaseDate,
    Year: year,
    runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null),
    Runtime: formatRuntime(item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null)),

    // Ratings & Popularity
    vote_average: item.vote_average || 0,
    vote_count: item.vote_count || 0,
    imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
    popularity: item.popularity || 0,

    // Descriptions
    overview: item.overview || 'No synopsis available.',
    Plot: item.overview || 'No synopsis available.',

    // Categories & People
    genres: item.genres || genreNames.map((n) => ({ name: n })),
    genre_ids: item.genre_ids || [],
    Genre: genreNames.length > 0 ? genreNames.join(', ') : 'N/A',
    Director: director,
    Writer: writers,
    Actors: actors,
    cast: item.credits?.cast || [],
    crew: item.credits?.crew || [],

    // Financials & Extras
    budget: item.budget,
    revenue: item.revenue,
    status: item.status || 'Released',
    number_of_seasons: item.number_of_seasons,
    number_of_episodes: item.number_of_episodes,
    trailerKey: officialTrailer?.key || null,
    videos: item.videos?.results || [],
    similar: (item.similar?.results || []).map((m) => normalizeMovie(m, isTV ? 'tv' : 'movie')),
    recommendations: (item.recommendations?.results || []).map((m) => normalizeMovie(m, isTV ? 'tv' : 'movie')),
    homepage: item.homepage,
  };
}

// Generic cached fetch wrapper with resilient fallback
async function fetchTmdb(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  const cacheKey = `${endpoint}?${queryParams.toString()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // Attempt standard URL first, fallback to direct URL if in dev and proxy fails
  const urlsToTry = [
    `${BASE_URL}${endpoint}?${queryParams.toString()}`,
  ];
  if (IS_DEV) {
    urlsToTry.push(`${FALLBACK_DIRECT_URL}${endpoint}?${queryParams.toString()}`);
  }

  let lastError = null;
  for (const url of urlsToTry) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        cache.set(cacheKey, data);
        return data;
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.error(`TMDB fetch failed for ${endpoint}:`, lastError);
  return null;
}

// 1. Trending Content (Movies, TV, All)
export async function getTrending({ mediaType = 'all', timeWindow = 'day', page = 1 } = {}) {
  const data = await fetchTmdb(`/trending/${mediaType}/${timeWindow}`, { page });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, mediaType === 'tv' ? 'tv' : 'movie'));
}

// 2. Discover / Now Playing Blockbusters
export async function getNowPlayingMovies(page = 1) {
  const data = await fetchTmdb('/movie/now_playing', { page });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

// 3. Top Rated All-Time Masterpieces
export async function getTopRatedMovies(page = 1) {
  const data = await fetchTmdb('/movie/top_rated', { page });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

// 4. Upcoming Anticipated Releases
export async function getUpcomingMovies(page = 1) {
  const data = await fetchTmdb('/movie/upcoming', { page });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

// 5. Popular Binge-Worthy TV Series
export async function getPopularTV(page = 1) {
  const data = await fetchTmdb('/tv/popular', { page });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'tv'));
}

// 6. Discover Movies or TV by Genre (respecting language and year)
export async function discoverByGenre({
  genreId,
  mediaType = 'movie',
  language = '',
  year = '',
  page = 1,
  sortBy = 'popularity.desc',
}) {
  const resolvedType = mediaType === 'series' || mediaType === 'tv' ? 'tv' : 'movie';
  const params = {
    with_genres: genreId,
    sort_by: sortBy,
    page,
  };
  if (language && language !== 'all') {
    params.with_original_language = language;
  }
  if (year) {
    if (resolvedType === 'tv') params.first_air_date_year = year;
    else params.primary_release_year = year;
  }
  const data = await fetchTmdb(`/discover/${resolvedType}`, params);
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, resolvedType));
}

// 7. Full Details (Appends Videos, Credits, Similar, Recommendations)
export async function getMovieDetails(id, mediaType = 'movie') {
  if (!id) return null;
  // If id is in format 'tmdb_12345', strip prefix
  const cleanId = String(id).replace(/^tmdb_/, '');
  
  // Try mediaType as movie first, or tv if specified
  const endpoint = `/${mediaType}/${cleanId}`;
  let data = await fetchTmdb(endpoint, {
    append_to_response: 'videos,credits,similar,recommendations',
  });

  // If failed and was default 'movie', try as 'tv'
  if (!data && mediaType === 'movie') {
    data = await fetchTmdb(`/tv/${cleanId}`, {
      append_to_response: 'videos,credits,similar,recommendations',
    });
    if (data) return normalizeMovie(data, 'tv');
  }

  return data ? normalizeMovie(data, mediaType) : null;
}

// 8. Tamil Cinema Specialized Handlers (70% Focus)
export async function getTamilTrending(page = 1) {
  const data = await fetchTmdb('/discover/movie', {
    with_original_language: 'ta',
    sort_by: 'popularity.desc',
    'vote_count.gte': '15',
    page,
  });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

export async function getTamilTopRated(page = 1) {
  const data = await fetchTmdb('/discover/movie', {
    with_original_language: 'ta',
    sort_by: 'vote_average.desc',
    'vote_count.gte': '35',
    page,
  });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

export async function getTamilNowPlaying(page = 1) {
  const currentYear = new Date().getFullYear();
  const data = await fetchTmdb('/discover/movie', {
    with_original_language: 'ta',
    sort_by: 'popularity.desc',
    primary_release_year: currentYear,
    page,
  });
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, 'movie'));
}

// 9. Discover Movies by Selected Language
export async function getMoviesByLanguage({
  language = 'ta',
  mediaType = 'movie',
  sortBy = 'popularity.desc',
  genreId = '',
  year = '',
  page = 1,
}) {
  const resolvedType = mediaType === 'series' || mediaType === 'tv' ? 'tv' : 'movie';
  const params = {
    sort_by: sortBy,
    page,
  };
  if (sortBy === 'vote_average.desc') {
    params['vote_count.gte'] = '10';
  }
  if (language && language !== 'all') {
    params.with_original_language = language;
  }
  if (genreId) {
    params.with_genres = genreId;
  }
  if (year) {
    if (resolvedType === 'tv') params.first_air_date_year = year;
    else params.primary_release_year = year;
  }

  const endpoint = `/discover/${resolvedType}`;
  const data = await fetchTmdb(endpoint, params);
  if (!data?.results) return [];
  return data.results.map((item) => normalizeMovie(item, resolvedType));
}

// 10. Search across Movies and TV Shows with optional language filter
export async function searchMovies({ query, page = 1, type = '', year = '', language = '' }) {
  if (!query || !query.trim()) {
    return { Search: [], totalResults: 0, Response: 'False' };
  }

  const cleanQuery = query.trim();
  let endpoint = '/search/multi';
  const params = { query: cleanQuery, page };

  if (type === 'movie') {
    endpoint = '/search/movie';
    if (year) params.primary_release_year = year;
  } else if (type === 'series' || type === 'tv') {
    endpoint = '/search/tv';
    if (year) params.first_air_date_year = year;
  } else if (year) {
    endpoint = '/search/movie';
    params.primary_release_year = year;
  }

  const data = await fetchTmdb(endpoint, params);

  if (data && data.results) {
    // Filter out person results from multi search if any
    let filtered = data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv' || (!item.media_type && (item.title || item.name))
    );

    // If specific language filter requested, filter results
    if (language && language !== 'all') {
      filtered = filtered.filter((item) => item.original_language === language);
    }

    const normalizedResults = filtered.map((item) =>
      normalizeMovie(item, type === 'series' || type === 'tv' ? 'tv' : 'movie')
    );

    return {
      Search: normalizedResults,
      totalResults: data.total_results || 0,
      totalPages: data.total_pages || 1,
      Response: 'True',
    };
  }

  return { Search: [], totalResults: 0, Response: 'False', Error: 'No titles found' };
}

