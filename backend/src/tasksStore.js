
let tasks = [];
let nextId = 1;

function getAllTasks(filters = {}) {
  let result = [...tasks];

  if (filters.status) {
    result = result.filter(task => task.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(task =>
      task.title.toLowerCase().includes(searchLower)
    );
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTaskById(id) {
  return tasks.find(task => task.id == id);
}

function createTask(taskData) {
  const newTask = {
    id: nextId++,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, updates) {
    const index = tasks.findIndex(task => task.id == id);
    if (index === -1) return null;

    tasks[index] = {
        ...tasks[index],
        ...updates,
        id: tasks[index].id,
        createdAt: tasks[index].createdAt
    };
    return tasks[index];
}

function deleteTask(id) {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id != id);
    return tasks.length < initialLength;
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}