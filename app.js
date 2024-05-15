const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/movies/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  }
}

//API1
app.get('/movies/', async (request, response) => {
  const getMovieQuery = `select movie_name from movie`
  const moviesArray = await db.all(getMovieQuery)
  response.send(
    moviesArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

//API2
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `
    INSERT INTO movie (director_id, movie_name, lead_actor)
    VALUES (${directorId}, '${movieName}', '${leadActor}')
  `
  await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})
