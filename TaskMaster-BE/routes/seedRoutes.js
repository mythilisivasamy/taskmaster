import express from 'express';
import Task from '../models/taskModel.js';

import taskList from '../data.js';

// api
const seedRouter = express.Router();
seedRouter.get('/', async (req, res) => {
  await Task.deleteMany({});
  const createdTasks = await Task.insertMany(taskList);

  res.send({ createdTasks });
});

export default seedRouter;
