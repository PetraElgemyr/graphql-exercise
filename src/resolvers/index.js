const path = require("path");
const fsPromises = require("fs/promises");
const { fileExists, readJsonFile } = require("../utils/fileHandling");
const { GraphQLError, printType } = require("graphql");
const crypto = require("node:crypto");
const { log } = require("console");
const { argsToArgsConfig } = require("graphql/type/definition");
const axios = require("axios").default;
// Create a variable holding the file path (from computer root directory) to the project fiel directory

exports.resolvers = {
  Query: {
    getAllMovies: async (_, args) => {
      let movies = [];
      try {
        const response = await axios.get(process.env.SHEETDB_URI);

        if (response.data.length > 0) {
          movies = response.data;
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
        return new GraphQLError("Couldn't get data");
      }
      return movies;
    },
  },
  Mutation: {
    addMovie: async (_, args) => {
      const { title, year, imgUrl } = args.input;

      const newMovie = {
        id: crypto.randomUUID(),
        title,
        year,
        imgUrl,
      };

      try {
        const endpoint = process.env.SHEETDB_URI;
        const response = await axios.post(
          endpoint,
          {
            data: [newMovie],
          },
          {
            headers: {
              "Accept-Encoding": "gzip,deflate,compress",
            },
          }
        );
      } catch (error) {
        console.error(error);
        return new GraphQLError("Couldn't add the movie to our collection...");
      }
      return newMovie;
    },
    deleteMovie: async (_, args) => {
      const movieId = args.movieId;

      try {
        const endpoint = `${process.env.SHEETDB_URI}/id/${movieId}`;
        const response = await axios.delete(endpoint);
        console.log(response.data);
        return {
          deletedId: movieId,
          deleteSuccess: true,
        };
      } catch (error) {
        console.log(error);
        return new GraphQLError("Oops couldn't delete that movie");
      }
    },
  },
};
