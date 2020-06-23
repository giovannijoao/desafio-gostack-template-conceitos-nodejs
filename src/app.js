const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => response.json(repositories));

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const send = (body, code = 200) => response.status(code).json(body);
  if (!title) return send({ message: 'Missing title in body.' }, 400);
  if (!url) return send({ message: 'Missing url in body.' }, 400);
  if (!techs) return send({ message: 'Missing techs in body.' }, 400);
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repo);
  return send(repo);
});

app.put("/repositories/:id", (request, response) => {
  const send = (body, code = 200) => response.status(code).json(body);
  const { id } = request.params;
  if (!id) return send({ message: 'Missing id in params.' }, 400);
  const { title, url, techs } = request.body;
  const itemIndex = repositories.findIndex(item => item.id === id);
  if (itemIndex === -1) return send({ message: 'Repository not found. ' }, 400);
  const item = repositories[itemIndex];
  repositories[itemIndex] = {
    ...item,
    title,
    url,
    techs,
  }
  return send(repositories[itemIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const send = (body, code = 200) => response.status(code).json(body);
  const { id } = request.params;
  if (!id) return send({ message: 'Missing id in params.' }, 400);
  const itemIndex = repositories.findIndex(item => item.id === id);
  if (itemIndex === -1) return send({ message: 'Repository not found. ' }, 400);
  repositories.splice(itemIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const send = (body, code = 200) => response.status(code).json(body);
  const { id } = request.params;
  if (!id) return send({ message: 'Missing id in params.' }, 400);
  const itemIndex = repositories.findIndex(item => item.id === id);
  if (itemIndex === -1) return send({ message: 'Repository not found. ' }, 400);
  repositories[itemIndex].likes++;
  return send(repositories[itemIndex]);
});

module.exports = app;
