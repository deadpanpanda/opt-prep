<template>
  <div class="container">
    <header>
      <h1>Task Tracker</h1>
    </header>

    <main>
      <section class="form-section">
        <h2>Create New Task</h2>
        <TaskForm @task-created="handleTaskCreated" />
      </section>

      <section class="filter-section">
        <h2>Filter Tasks</h2>
        <TaskFiltersComponent :filters="filters" @filters-changed="handleFiltersChanged" />
      </section>

      <section class="tasks-section">
        <div class="task-header">
          <h2>Tasks</h2>

          <div class="reload">
            <button @click="loadTasks">Reload</button>
          </div>
        </div>

        <div class="loading" v-if="loading">Loading tasks...</div>

        <div class="error" v-else-if="error">
          <p>{{ error }}</p>
          <button @click="loadTasks">Retry</button>
        </div>

        <TaskList
          v-else
          :tasks="tasks"
          @task-deleted="handleTaskDeleted"
          @task-updated="handleTaskUpdated"
        />
      </section>
    </main>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTasks, type Task, type TaskFilters } from './api'; 
import TaskForm from './components/TaskForm.vue';
import TaskFiltersComponent from './components/TaskFilters.vue';
import TaskList from './components/TaskList.vue';

const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref('');
const filters = ref<TaskFilters>({});

async function loadTasks() {
  loading.value = true;
  error.value = '';

  try {
    tasks.value = await getTasks(filters.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load tasks';
  } finally {
    loading.value = false;
  }
}

function handleTaskCreated(task: Task) {
  tasks.value.unshift(task);
}

function handleTaskUpdated(updated: Task) {
  const index = tasks.value.findIndex(t => t.id === updated.id);
  if (index !== -1) {
    tasks.value[index] = updated;
  }
}

function handleTaskDeleted(id: number) {
  tasks.value = tasks.value.filter(t => t.id !== id);
}

function handleFiltersChanged(newFilters: TaskFilters) {
  filters.value = newFilters;
  loadTasks();
}

onMounted(() => {
  loadTasks();
});

</script>

<style lang="scss" scoped>

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: white;
  margin: 0;
}

h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 1rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #666;

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  
    &:hover {
      background: #2980b9;
    }
  }
}

button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  
    &:hover {
      background: #2980b9;
    }
}

.task-header {
  display: flex;
  justify-content: space-between;
}
</style>