const apiKey = '8c81008c2015d663219e2f61160ecb71'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Función para obtener y mostrar películas populares
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=1`);
        const data = await response.json();
        displayMovies(data.results); // Muestra las películas populares
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Función para mostrar películas en la lista
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic
        movieList.appendChild(li);
    });
}

// Función para mostrar detalles de la película
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-ES`);
        const movie = await response.json();
        
        // Muestra los detalles de la película seleccionada
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        `;
        movieDetails.classList.remove('hidden');
        selectedMovieId = movieId; // Actualiza la película seleccionada
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Función para buscar películas
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&language=es-ES&query=${query}`);
            const data = await response.json();
            displayMovies(data.results); // Muestra las películas que coinciden
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Función para agregar a favoritos
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Función para mostrar películas favoritas
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Al cargar la página, obtén las películas populares y muestra las favoritas
fetchPopularMovies(); // Muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
