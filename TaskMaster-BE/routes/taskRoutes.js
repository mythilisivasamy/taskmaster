import express from 'express';
import Task from '../models/taskModel.js';
import { CustomError } from '../middleware/errorHandler.js';
import asyncHandler from 'express-async-handler';
import { isAuth } from '../middleware/protectedRoute.js';
const taskRouter = express.Router();

taskRouter.get('/', async (req, res, next) => {
  try {
    const taskLists = await Task.find({});
    res.status(200).json(taskLists);
  } catch (err) {
    const error = new CustomError(`Could not get the taskLists`, 500);
    next(error);
  }
});

taskRouter.post('/', async (req, res, next) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      status: req.body.status,
    });
    await newTask.save();
    res.send({
      message: 'task saved',
      statusCode: '201',
      task: newTask,
    });
  } catch (err) {
    res.status(404).send({ message: 'Error on client request', err });
  }
});

taskRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (task) {
      task.title = req.body.title;
      task.description = req.body.description;
      task.dueDate = req.body.dueDate;
      task.status = req.body.status;
      const updatedTask = await task.save();
      res.status(201).json({
        message: 'task Updated',
        statusCode: '201',
        task: updatedTask,
      });
    } else {
      res.status(404).send({ message: 'task Not Found' });
    }
  })
);

taskRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    
    if (task) {
      const deletedtask = await task.deleteOne();
      res.send({
        message: 'task Deleted',
        statusCode: '201',
        task: deletedtask,
      });
    } else {
      res.status(404).send({ message: 'task Not Found' });
    }
  })
);

export default taskRouter;
