const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)) return response.status(400).json({ error: 'parameter id is not valid'});

  console.log(isUuid(id));

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(400).json({ error: 'Repository id not found'});

  const repository = repositories[repositoryIndex];

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs) {
    repository.techs = techs;
  }

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)) return response.status(400).json({ error: 'parameter id is not valid'});

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(400).json({ error: 'Repository id not found'});

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)) return response.status(400).json({ error: 'parameter id is not valid'});

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) return response.status(400).json({ error: 'Repository id not found'});
  
  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
