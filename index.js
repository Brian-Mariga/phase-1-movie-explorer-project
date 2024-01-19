document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const movieContainer = document.getElementById("movieContainer");
  searchInput.addEventListener("input", debounce(handleSearch, 0));

  async function handleSearch() {}

  function searchMovies(query) {}

  function displayMovies(movies) {}
  async function handleMovieClick(movieId) {}
});
