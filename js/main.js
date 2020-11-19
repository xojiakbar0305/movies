var newMovies = movies.splice(0, 300);

var compactMovies = newMovies.map(function(movie, i) {
  return {
    id: i + 1,
    title: movie.Title.toString(),
    image: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imdbRating: movie.imdb_rating,
    youtubeId: movie.ytid,
  }
});

var elMoviesBox = $_('.movies-list');
var elMoviesTemlate = $_('#moviesTemplate').content;
var elSearchForm = $_('.movies-search-form');
var elSearchInput = $_('.movies-search-input', elSearchForm);
var elRatingInput = $_('.movie-rating', elSearchForm)

var createMoviesElement = function (movie) {
  var cloneMovies = elMoviesTemlate.cloneNode(true);

  $_('.movie-title', cloneMovies).textContent = movie.title;
  $_('.movie-img-youtube', cloneMovies).src = movie.image;
  $_('.movie-year', cloneMovies).textContent = movie.year;
  $_('.movie-summar', cloneMovies).textContent = movie.summary;
  $_('.movie-categories', cloneMovies).textContent = movie.categories.join(', ');
  $_('.movie-youtube', cloneMovies).textContent = `Watch List`;
  $_('.movie-youtube', cloneMovies).href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;
  $_('.movie-rating', cloneMovies).textContent = `Movie Rating: ${movie.imdbRating}`;
  
  return cloneMovies;
}

//render 
var renderMovies = function (movies) {
  elMoviesBox.innerHTML = '';

  elKinolarFrogmentBox = document.createDocumentFragment();

  movies.forEach(function (movie) {
    elKinolarFrogmentBox.appendChild(createMoviesElement(movie));
  });

  elMoviesBox.appendChild(elKinolarFrogmentBox);
};

//option
var newCategorieArray = []
var elCategorieSelect = $_('.search-select', elSearchForm);

compactMovies.forEach(function (movie) {
  movie.categories.forEach(function (categorie) {
    if (!(newCategorieArray.includes(categorie))) {
      newCategorieArray.push(categorie)
      var elNewOption = createElement('option', '', categorie);
      elNewOption.value = categorie;
      elCategorieSelect.appendChild(elNewOption);
    } 
  });
});
//qidruv
var searchForMovies = function (evt) {
  evt.preventDefault();

  var movieInputValues = elSearchInput.value === '' || elRatingInput.value === '';

  if (isNaN(elRatingInput.value)) {
    alert('Son kiriting');
    elRatingInput.value = '';
    elRatingInput.focus();
    return;
  }

  if (movieInputValues) {
    alert(`ma'lumot kiriting`);
    elSearchInput.value = '';
    elSearchInput.focus();
    return;
  }

  var searchInput = elSearchInput.value.trim();
  var categoriesValue = elCategorieSelect.value;
  var minimumRatingValue = parseFloat(elRatingInput.value.trim(), 10);

  var searchQuery = new RegExp(searchInput, 'gi');

  var searchResult = compactMovies.filter(function (movie) {

    var checkTitle = movie.title.match(searchQuery);
    var checkCategorie = movie.categories.includes(categoriesValue);
    var checkImdbRating = movie.imdbRating >= minimumRatingValue;
    return (checkTitle && checkCategorie && checkImdbRating);

  });

  if (!searchResult.length) {
    alert(`bunday kino yo'q`);
    return;
  }

  renderMovies(searchResult);
}

renderMovies(compactMovies)

//submit
elSearchForm.addEventListener('submit', searchForMovies)