require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { resolvers } = require('./resolvers')
const { loadFiles } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const path = require('path')
const { expressMiddleware } = require('@apollo/server/express4')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors)

app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'views')))
const port = process.env.PORT || 5000

async function run() {
	try {
		// Loads our schema.graphql file and reformats it for use in the next step
		const typeDefs = await loadFiles(path.join(__dirname, 'schema.graphql'))
		// Creates a schema from our typeDefs (see step above) and our resolvers
		const schema = makeExecutableSchema({
			typeDefs: typeDefs,
			resolvers: resolvers,
		})
		// Creates a GraphQL server from our schema
		const server = new ApolloServer({ schema: schema })
		// Starts the server in
		await server.start()

		app.use('/graphql', app)
		// app.use('/graphql', expressMiddleware(server))

		app.listen(port, () => {
			console.log(`🚀 Server ready at http://localhost:${port}`)
		})
	} catch (error) {
		console.error(error)
	}
}

run()
