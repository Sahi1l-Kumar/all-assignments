/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
  - `npm run test-todo-list`
*/

class Todo {
  constructor() {
    this.todo = [];
  }
  add = (todo) => {
    return this.todo.push(todo);
  };
  remove = (indexOfTodo) => {
    return this.todo.splice(indexOfTodo, 1);
  };
  update = (index, updatedTodo) => {
    if (this.todo[index] == undefined) {
      return this.todo;
    }
    return (this.todo[index] = updatedTodo);
  };
  getAll = () => {
    return this.todo;
  };
  get = (indexOfTodo) => {
    if (this.todo[indexOfTodo] == undefined) {
      return null;
    }
    return this.todo[indexOfTodo];
  };
  clear = () => {
    this.todo = [];
  };
}

module.exports = Todo;
