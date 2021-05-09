import { Router } from 'express';
import { RoomModel, Todo, TodoModel } from '../models';
import { ApiResponse } from '../types';

export const roomsRouter = Router();

// Create list room.
roomsRouter.post('/rooms', async (req, res) => {
  let response: ApiResponse = {};

  try {
    const room = new RoomModel(req.body);
    const object = await room.save();

    response.data = object;
  } catch (err) {
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.send(response);
});

// Access an existing room.
roomsRouter.post('/rooms/:name/access', async (req, res) => {
  let response: ApiResponse = {};

  try {
    const roomQuery = RoomModel.findOne({
      name: req.params.name,
      password: req.body.password
    });
    const object = await roomQuery.exec();

    if (object === null) {
      throw new Error('Invalid room information.');
    }

    response.data = object;
  } catch (err) {
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.send(response);
});

// Create a todo in a room.
roomsRouter.post('/rooms/:name/todos', async (req, res) => {
  let response: ApiResponse = {};

  try {
    const todo = new TodoModel(req.body);
    const roomQuery = RoomModel.findOne({
      name: req.params.name
    });
    const roomObject = await roomQuery.exec();

    if (roomObject === null) {
      throw new Error('Invalid room information.');
    }

    roomObject.todos = [...roomObject.todos, todo];
    const object = await roomObject.save();

    response.data = object;
  } catch (err) {
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.send(response);
});

// Change a todo in a room.
roomsRouter.post('/rooms/:name/todos/:todoId', async (req, res) => {
  let response: ApiResponse = {};

  try {
    const roomQuery = RoomModel.findOne({
      name: req.params.name
    });
    const roomObject = await roomQuery.exec();

    if (roomObject === null) {
      throw new Error('Invalid room information.');
    }

    const index = roomObject.todos.findIndex(
      (todo) => todo._id === req.params.todoId
    );

    if (index < 0) {
      throw new Error('Something went wrong.');
    }

    const updatedTodo = new TodoModel({
      ...roomObject.todos[index],
      ...req.body
    });

    roomObject.todos = [...roomObject.todos];
    roomObject.todos[index] = updatedTodo;

    const object = await roomObject.save();

    response.data = object;
  } catch (err) {
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.send(response);
});

// Delete a todo in a room.
roomsRouter.delete('/rooms/:name/todos/:todoId', async (req, res) => {
  let response: ApiResponse = {};

  try {
    const roomQuery = RoomModel.findOne({
      name: req.params.name
    });
    const roomObject = await roomQuery.exec();

    if (roomObject === null) {
      throw new Error('Invalid room information.');
    }

    const index = roomObject.todos.findIndex(
      (todo) => todo._id === req.params.todoId
    );

    if (index < 0) {
      throw new Error('Something went wrong.');
    }

    roomObject.todos = [...roomObject.todos];
    roomObject.todos.splice(index, 1);

    const object = await roomObject.save();

    response.data = object;
  } catch (err) {
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.send(response);
});
