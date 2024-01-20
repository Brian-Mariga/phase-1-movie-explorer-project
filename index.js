document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "6d4c6627";
  const searchInput = document.getElementById("searchInput");
  const movieContainer = document.getElementById("movieContainer");
  searchInput.addEventListener("input", debounce(handleSearch, 0));

  async function handleSearch() {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() !== "") {
      const movies = await searchMovies(searchTerm);
      displayMovies(movies);
    } else {
      clearMovieContainer();
    }
  }

  async function searchMovies(query) {
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.Search || [];
    } catch (error) {
      console.error("Error fetching movie data:", error);
      return [];
    }
  }

  function displayMovies(movies) {
    clearMovieContainer();

    movies.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      movieCard.addEventListener("click", () => handleMovieClick(movie.imdbID));
      movieContainer.appendChild(movieCard);
    });
  }

  async function handleMovieClick(movieId) {
    try {
      const movieDetails = await fetchMovieDetails(movieId);
      displayMovieDetails(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  function clearMovieContainer() {
    movieContainer.innerHTML = "";
  }

  function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const title = document.createElement("h2");
    title.textContent = movie.Title;

    const year = document.createElement("p");
    year.textContent = `Year: ${movie.Year}`;

    card.appendChild(title);
    card.appendChild(year);

    return card;
  }

  async function fetchMovieDetails(movieId) {
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  function displayMovieDetails(movieDetails) {}

  async function handleLikeClick(likeButton, movieId) {}

  async function handleCommentClick(commentInput, movieId) {}

  async function fetchMovieLikes(movieId) {}

  async function updateMovieLikes(movieId, likes) {}

  async function fetchMovieComments(movieId) {}

  async function updateMovieComments(movieId, comments) {}
});
