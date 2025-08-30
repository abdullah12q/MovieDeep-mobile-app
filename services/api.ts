export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export async function getMovies(query?: string): Promise<Movie[]> {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  //query = "Iron Man & Hulk", in the url with encodeURIComponent it becomes "Iron%20Man%20%26%20Hulk"

  try {
    const response = await fetch(endpoint, { headers: TMDB_CONFIG.headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

export async function getGenres(): Promise<any> {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`,
      { headers: TMDB_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}

export async function getMovieDetails(movieId: string): Promise<MovieDetails> {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      { headers: TMDB_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function getSavedMovies(
  savedIds: string[]
): Promise<MovieDetails[]> {
  return Promise.all(savedIds.map((id) => getMovieDetails(id)));
}

export async function getMovieTrailers(movieId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
      { headers: TMDB_CONFIG.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trailers: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching trailers:", error);
    throw error;
  }
}
