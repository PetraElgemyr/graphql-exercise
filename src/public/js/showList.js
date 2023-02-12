let movies = []

const graphQlQuery = async (url, query, variables = {}) => {
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

const getAllMoviesQuery = `query Query {
	getAllMovies {
	  id
	  title
	  year
	  imgUrl
	}
  }`

const getMoviesBtn = document.getElementById('getAllMoviesBtn')

const getAllMovies = async () => {
	const response = await graphQlQuery('http://localhost:4000/graphql', getAllMoviesQuery)
	// console.log(response)
	movies = response.getAllMovies
	console.log(movies)
	createHtml(movies)
}

function createHtml(movies) {
	const listRoot = document.getElementById('rootList')
	listRoot.innerHTML = ''

	for (let i = 0; i < movies.length; i++) {
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

		listRoot.appendChild(movieContainer)
	}
}

getAllMovies()
