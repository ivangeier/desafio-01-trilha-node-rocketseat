const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => (user.username = username));

  if (!user) {
    return response.status(400).json({ error: "User not found." });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const id = uuidv4();

  const userAlreadyExist = users.some((user) => (user.username = username));

  if (userAlreadyExist) {
    return response.status(400).json({ error: "Username already exist" });
  }

  users.push({
    id,
    name,
    username,
    todo: [],
  });

  return response.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todo);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const id = uuidv4();
  const todo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todo.push(todo);

  return response.status(200).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoIndex = user.todo.findIndex((todo) => todo.id == id);

  if (todoIndex < 0) {
    return response.status(400).json({ error: "TODO ID not found!" });
  }

  user.todo[todoIndex].title = title;
  user.todo[todoIndex].deadline = new Date(deadline);

  return response.status(200).json(user.todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todo.findIndex((todo) => todo.id == id);

  if (todoIndex < 0) {
    return response.status(400).json({ error: "TODO ID not found!" });
  }

  user.todo[todoIndex].done = true;

  return response.status(200).json(user.todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
