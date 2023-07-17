const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { title } = require("process");

const app = express();

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.get("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.sendStatus(404);
    } else {
      res.json(todos[todoIndex]);
    }
  });
});

app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 100000),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.sendStatus(404);
    } else {
      const updatedTodo = {
        id: todos[todoIndex].id,
        title: req.body.title,
        description: req.body.description,
      };
      todos[todoIndex] = updatedTodo;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.send(updatedTodo);
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.sendStatus(404);
    } else {
      todos.splice(todoIndex, 1);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.send();
      });
    }
  });
});

app.listen(3000);
