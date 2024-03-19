import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import taskRouter from './routes/taskRoutes.js';
import userRouter from './routes/userRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import globalErrorHandler from './middleware/errorHandler.js';

// Connecting MongoDB
import connectDB from './database/connection.js';

// Initiating the Express Application
const app = express();
app.use(express.json());
app.use(cors());

//Configuring Process Environment Variables
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT;
connectDB();

//parsing request
app.use(bodyParser.urlencoded({ extended: true }));

//loading routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/seed', seedRouter);
app.use(globalErrorHandler);

// Express Server Listening at the port
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
