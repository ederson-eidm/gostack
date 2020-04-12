const express = require("express");
const cors = require("cors");
const { uuid, isUuid} = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {techs} = request.query;

  const result = techs
    ? repositories.filter(project => project.techs.includes(techs))
    : repositories;
  return response.json(result);
;});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0,
   };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if( repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist'});
  }

  const repository = {
    id, 
    title, 
    url, 
    techs,
    likes: 0,
   };

   repositories[repositoryIndex] = repository;

   return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if( repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  console.log(repository);

  if(!isUuid(id) || repository === undefined) {
    return response.status(400).json({ error: 'Repository does not exist'});
  }
   
   repository.likes += 1;

  return response.json(repository);
});

module.exports = app;