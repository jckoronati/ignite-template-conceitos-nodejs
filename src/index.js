const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user)
    return response.status(404).json({ error: "User not found!" });

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  const usernameAlreadyInUse = users.some((user) => user.username === username);

  if (usernameAlreadyInUse)
    return response.status(400).json({ error: "Username is already in use" });

  const userFormatted = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(
    userFormatted
  );

  return response.status(201).json(userFormatted);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.query;
  const { title, deadline } = request.body;

  const todo = user.todos.some((todo) => {
    return todo.id === id;
  });

  if (!todo)
    return response.status(404).json({ error: "The entered value was not found." });

  console.log(todo);

  return response.status(200).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;