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

  function displayMovieDetails(movieDetails) {
    clearMovieContainer();

    const title = document.createElement("h2");
    title.textContent = movieDetails.Title;

    const year = document.createElement("p");
    year.textContent = `Year: ${movieDetails.Year}`;

    const plot = document.createElement("p");
    plot.textContent = `Plot: ${movieDetails.Plot}`;

    const image = document.createElement("img");
    image.src = movieDetails.Poster;
    image.alt = movieDetails.Title;

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like";
    likeButton.classList.add("interaction");
    likeButton.setAttribute("id", "like-button");
    likeButton.addEventListener("click", () =>
      handleLikeClick(likeButton, movieDetails.imdbID)
    );

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Add your comment...";
    commentInput.classList.add("interaction");
    commentInput.setAttribute("id", "comment-input");

    const commentButton = document.createElement("button");
    commentButton.textContent = "Add Comment";
    commentButton.setAttribute("id", "comment-button");
    commentButton.classList.add("interaction");
    commentButton.addEventListener("click", () =>
      handleCommentClick(commentInput, movieDetails.imdbID)
    );

    const commentsContainer = document.createElement("div");
    commentsContainer.setAttribute("id", "comments-container");
    movieContainer.appendChild(title);
    movieContainer.appendChild(image);
    movieContainer.appendChild(year);
    movieContainer.appendChild(plot);
    movieContainer.appendChild(likeButton);
    movieContainer.appendChild(commentInput);
    movieContainer.appendChild(commentButton);
    movieContainer.appendChild(commentsContainer);
  }

  async function handleLikeClick(likeButton, movieId) {
    try {
      const existingLikes = await fetchMovieLikes(movieId);
      const updatedLikes = existingLikes + 1;

      await updateMovieLikes(movieId, updatedLikes);

      console.log(`Movie ${movieId} Liked! New Likes: ${updatedLikes}`);

      likeButton.classList.toggle("liked");
      likeButton.textContent = likeButton.classList.contains("liked")
        ? "Unlike"
        : "Like";
    } catch (error) {
      console.error("Error handling like:", error);
    }
  }

  async function handleCommentClick(commentInput, movieId) {
    try {
      const comment = commentInput.value;
      if (comment.trim() !== "") {
        const existingComments = await fetchMovieComments(movieId);

        const updatedComments = [...existingComments, comment];

        await updateMovieComments(movieId, updatedComments);

        console.log(`Comment added for Movie ${movieId}: ${comment}`);

        displayComments(updatedComments, movieId);
      }
    } catch (error) {
      console.error("Error handling comment:", error);
    }
  }

  async function fetchMovieLikes(movieId) {}

  async function updateMovieLikes(movieId, likes) {
    console.log(`Updating likes for Movie ${movieId} to ${likes}`);
  }

  async function fetchMovieComments(movieId) {
    return [];
  }

  async function updateMovieComments(movieId, comments) {
    console.log(`Updating comments for Movie ${movieId} to`, comments);
  }
  function displayComments(comments, movieId) {
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.innerHTML = "";

    comments.forEach((comment) => {
      const commentElement = document.createElement("p");
      commentElement.textContent = `Comment: ${comment}`;
      commentsContainer.appendChild(commentElement);
    });
  }

  function debounce(func, delay) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
});
