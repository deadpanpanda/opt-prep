<template>
 <form @submit.prevent="handleSubmit">
  <div class="form-group">
    <label for="title">Title *</label>
    <input
      id="title"
      v-model="title"
      type="text"
      placeholder="Enter task title"
      :disabled="loading"
      required
    />
  </div>

  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      id="description"
      v-model="description"
      placeholder="Enter task description (optional)"
      :disabled="loading"
      rows="3"
    />
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" v-model="status" :disabled="loading">
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <div class="form-group">
      <label for="priority">Priority</label>
      <select id="priority" v-model="priority" :disabled="loading">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>

  <div v-if="error" class="error">{{ error }}</div>

  <button type="submit" :disabled="loading">
    {{ loading ? 'Creating...' : 'Create Task' }}
  </button>
 </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTask, type TaskStatus, type TaskPriority } from '../api';

const emit = defineEmits<{
  'task-created': [task: any]
}>();

const title = ref('');
const description = ref('');
const status = ref<TaskStatus>('todo');
const priority = ref<TaskPriority>('medium');
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  if (!title.value.trim()) {
    error.value = 'Title is required';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const newTask = await createTask({
      title: title.value,
      description: description.value,
      status: status.value,
      priority: priority.value,
    });

    emit('task-created', newTask);

    title.value = '';
    description.value = '';
    status.value = 'todo';
    priority.value = 'medium';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create task';
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

input,
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
}

button {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
}

.error {
  color: #e74c3c;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: #fadbd8;
  border-radius: 4px;
}

</style>