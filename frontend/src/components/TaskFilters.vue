<template>
  <div class="filters">
    <div class="filter-group">
      <label for="status-filter">Status</label>
      <select id="status-filter" v-model="statusFilter">
        <option value="">All</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="search-filter">Search</label>
      <input
        type="text"
        id="search-filter"
        v-model="searchFilter"
        placeholder="Search by title..."
      />
    </div>

    <button @click="clearFilters" class="clear-btn">Clear Filters</button>
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TaskFilters as Filters, TaskStatus } from '../api';

const props = defineProps<{
  filters: Filters;
}>();

const emit = defineEmits<{
  'filters-changed': [filters: Filters]
}>();

const statusFilter = ref<TaskStatus | ''>(props.filters.status || '');
const searchFilter = ref(props.filters.search || '');

let debounceTimeout: number | undefined;

watch([statusFilter, searchFilter], () => {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    emit('filters-changed', {
      status: statusFilter.value,
      search: searchFilter.value,
    });
  }, 300) as unknown as number;
});

function clearFilters() {
  statusFilter.value = '';
  searchFilter.value = '';
}
</script>

<style lang="scss" scoped>

.filters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
}

.clear-btn {
  padding: 0.75rem 1.5rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #7f8c8d;
  }
}
</style>