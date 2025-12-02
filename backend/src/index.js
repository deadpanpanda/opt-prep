const express = required('express');
const cors = require('cors');
const morgan = require('morgan');
const tasksRouter = require('./tasksRouter');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Task Tracker API' });
});

// TODO: add /api/tasks routes here

app.listen(PORT, () => {
  console.log('Server listening on localhost:${PORT}');
});