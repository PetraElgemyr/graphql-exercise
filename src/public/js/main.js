console.log('hej')

const graphQlQueryBase = async (url, query, variables = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query, //lägg in egen query
			variables, //lägg in egen variabel med inputs
		}),
	})
	const res = await response.json()
	return res.data
}

let title = document.getElementById('title')
let year = document.getElementById('year')
let url = document.getElementById('imgUrl')

const addMovieQuery = `mutation AddMovie($input: addMovieInput) {
	addMovie(input: $input) {
	  id
	  title
	  year
	  imgUrl
	}
  }`

const addMovieBtn = document.getElementById('addMovie')

addMovieBtn?.addEventListener('click', async (e) => {
	e.preventDefault()
	console.log(title.value, ' titeln skickad')

	if (title.value !== '' && year.value !== '' && url.value !== '') {
		const response = await graphQlQueryBase('http://localhost:4000/graphql', addMovieQuery, {
			input: {
				title: title.value,
				year: year.value,
				imgUrl: url.value,
			},
		})
		console.log(response)

		let movie = response.addMovie
		console.log('detta är nya filmen som data: ', movie)
		document.location.href = './newMovieAdded.html'
	} else {
		let formBox = document.getElementById('addForm')
		let errorBox = document.createElement('p')
		errorBox.className = 'errorMsg'
		errorBox.innerHTML = 'You need to fill all the fields before you can add a movie to the list!'
		formBox.appendChild(errorBox)
	}
})

let movies = []
let searchButton = document.getElementById('searchBtn')
searchButton.addEventListener('click', async () => {
	const getAllMoviesQuery = `query Query {
		getAllMovies {
		  id
		  title
		  year
		  imgUrl
		}
	  }`

	const response = await graphQlQueryBase('http://localhost:4000/graphql', getAllMoviesQuery)
	// console.log(response)
	movies = response.getAllMovies
	console.log('filmerna', movies)

	let input = document.getElementById('searchInput')
	let resultBox = document.getElementById('searchedBox')
	let text = input.value
	let newText = text.toLowerCase().trim()
	console.log(newText)

	for (let i = 0; i < movies.length; i++) {
		let movieTitle = movies[i].title
		let newTitle = movieTitle.toLowerCase().trim()

		if (newText === newTitle) {
			resultBox.innerHTML = 'Yay! This movie was on the list'

			let movieContainer = document.createElement('div')
			let title = document.createElement('p')
			let year = document.createElement('span')
			let img = document.createElement('img')
			// let movieId = document.createElement('span')

			movieContainer.classList.add('movie__container')
			title.innerHTML = movies[i].title
			year.innerHTML = movies[i].year
			img.src = movies[i].imgUrl
			img.classList.add('book__img')
			// movieId.innerHTML = 'Registreringsnummer: ' + movies[i].id

			movieContainer.append(img, title, year /*movieId  */)

			resultBox.appendChild(movieContainer)
		}
	}
})
