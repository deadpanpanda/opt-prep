const express = required('express');
const cors = require('cors');
const morgan = require('morgan');
const tasksRouter = require('./tasksRouter');
const {errorHandler, notFoundHandler} = require('./errorMiddleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tasks', tasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server listening on localhost:${PORT}');
});