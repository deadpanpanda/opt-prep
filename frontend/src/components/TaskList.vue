<template>
  <div class="task-list">
    <div class="empty" v-if="tasks.length === 0">
      No tasks found. Create one to get started!
    </div>

    <div
      class="task-item"
      v-for="task in tasks"
      :key="task.id"
      :class="{ done: task.status === 'done' }"
    >
      <input
        type="checkbox"
        :checked="task.status === 'done'"
        :disabled="loadingTasks.has(task.id)"
        @change="toggleStatus(task)"
      />

      <div class="task-content">
        <h3 class="task-title">{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">
          {{ task.description }}
        </p>
        <div class="task-meta">
          <span class="badge" :class="`status-${task.status}`">
            {{ task.status === 'in-progress' ? 'In Progress' : task.status }}
          </span>
          <span class="badge" :class="`priority-${task.priority}`">
            {{ task.priority }}
          </span>
        </div>
      </div>

      <button
        class="delete-btn"
        :disabled="loadingTasks.has(task.id)"
        @click="handleDelete(task)"
      >
      Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { updateTask, deleteTask, type Task } from '../api';

defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  'task-updated': [task: Task];
  'task-deleted': [id: number];
}>();

const loadingTasks = ref(new Set<number>());

async function toggleStatus(task: Task) {
  if (loadingTasks.value.has(task.id)) return;

  loadingTasks.value.add(task.id);

  try {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const updated = await updateTask(task.id, { status: newStatus });
    emit('task-updated', updated);
  } catch (err) {
    console.error('Failed to update task:', err);
    alert('Failed to update task');
  } finally {
    loadingTasks.value.delete(task.id);
  }
}

async function handleDelete(task: Task) {
  if (loadingTasks.value.has(task.id)) return;

  loadingTasks.value.add(task.id);

  try {
    await deleteTask(task.id);
    emit('task-deleted', task.id);
  } catch (err) {
    console.error('Failed to delete task:', err);
    alert('Failed to delete task');
    loadingTasks.value.delete(task.id);
  }
}
</script>

<style lang="scss" scoped>

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #95a5a6;
  font-size: 1.1rem;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
  }

  &.done {
    opacity: 0.6;

    .task-title {
      text-decoration: line-through;
    }
  }
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.task-description {
  margin: 0 0 0.75rem 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-todo {
  background: #ecf0f1;
  color: #34495e;
}

.status-in-progress {
  background: #fff3cd;
  color: #856404
}

.status-done {
  background: #d4edda;
  color: #155724;
}

.priority-low {
  background: #d1ecf1;
  color: #0c5460;
}

.priority-medium {
  background: #fff3cd;
  color: #856404;
}

.priority-high {
  background: #f8d7da;
  color: #721c24;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #c0392b;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
}
</style>