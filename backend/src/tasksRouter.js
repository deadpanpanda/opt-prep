
import express from 'express';
import * as store from './tasksStore.js';

const router = express.Router();

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTask(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate && (!data.title || !data.title.trim())) {
        errors.push('Title is required');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
        errors.push('Status must be: ${VALID_STATUSES.join(', ')}');
    }

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
        errors.push('Priority must be: ${VALID_PRIORITIES.join(', ')}');
    }

    return errors;
}

router.get('/', (req, res) => {
    const {status, search} = req.query;
    const tasks = store.getAllTasks({status, search})
    res.json(tasks);
});

router.get('/:id', (req, res) => {
    const task = store.getTaskById(req.params.id);
    if (!task) return res.status(404).json({error: 'Task not found'});
    res.json(task);
});

router.post('/', (req, res) => {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({error: errors.join(', ')});

    const newTask = store.createTask(req.body);
    res.status(201).json(newTask);
});

router.patch('/:id', (req, res) => {
    const errors = validateTask(req.body, true);
    if (errors.length) return res.status(400).json({error: errors.join(', ')});

    const updated = store.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({error: 'Task not found'});
    res.json(updated);
});

router.delete('/:id', (req, res) => {
    const deleted = store.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({error: 'Task not found'});
});

export default router;