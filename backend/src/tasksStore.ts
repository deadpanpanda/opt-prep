
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: string;
}

export interface TaskFilters {
    status?: string;
    search?: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}

let tasks: Task[] = [];
let nextId = 1;

export function getAllTasks(filters: TaskFilters = {}): Task[] {
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

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTaskById(id: string | number): Task | undefined {
  return tasks.find(task => task.id == id);
}

export function createTask(taskData: CreateTaskData): Task {
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

export function updateTask(id: string | number, updates: UpdateTaskData): Task | null {
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

export function deleteTask(id: string | number): boolean {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id != id);
    return tasks.length < initialLength;
}