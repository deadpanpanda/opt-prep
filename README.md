# opt-prep
Proactive prep for Opt

I plan to share this repository with the interview contact to show some proactive prep for the role. This will be rough, and I am aiming to solidify the core concepts I'm expecting to need to be familiar with. I will use this as a base for what I want to build, then rebuild it a few times over the next two days to become more competent pulling this from muscle over memory.

I will be making a task tracker full-stack app. I will be using Vue and Node.js with Express. I will not be including a DB as I feel that extends beyond the interview expectations.

---

# Task Spec
* **Backend:** Node.js + Express
* **Frontend:** Vue 3 + Vite
* **Date Storage:** In-memory array (No DB)

Demonstrate clean APIs, simple UI, connect frontend to backend, error handling, and project structure.

---

# Dependencies

## Backend

```bash
npm init -y
npm install express cors morgan
npm install -D nodemon
```

- **express** - Web framework for building the REST API
- **cors** - Enable Cross-Origin Resource Sharing (frontend on 5173 can call backend on port 3000)
- **nodemon** - Auto-restarts server when code changes (dev only)
- **morgan** - HTTP request terminal logger

## Frontend

```bash
npm create vite@latest frontend -- --template vue-ts
```

Vite handles everything. No additional dependencies needed beyond what is initialised.

---

# Functional Requirements

## 1. **Task Model**

* id - string or number
* title - string, required
* description - string, optional
* status (enum: "todo", "in-progress", "done", default "todo")
* priority (enum: "low", "medium", "high", default "medium")
* createdAt (ISO string)

# Backend Requirements (Node.js + Express)

## Base URL

```
/api/tasks
```

## Endpoints

### **GET /api/tasks**

 Retrieve all tasks.

 **Query Params:**

* `status` (optional) - filter by status
* `search` (optional) - case-insensitive search in title

**Response:**

* `200 OK`
* Array of tasks

---

### **POST /api/tasks**

Create a new task.

**Request Body:**

```json
{
  "title": "Implement API",
  "description": "Write endpoints",
  "status": "todo",
  "priority": "high"
}
```

**Validations:**

* `title` is required and must be a non-empty string
* `status` and `priority` must be valid enum values if provided

**Response:**

* `201 Created`
* Returns created task

---

### **PATCH /api/tasks/:id**

Update any subset of task fields.

**Rules:**

* Validate updated fields
* Must return `404` if task does not exist

**Response:**

* `200 OK` with updated task
* or `404 Not Found`

---

### **DELETE /api/tasks/:id**

Delete a task by ID.

**Response:**

* `204 No Content`
* or `404 Not Found`

---

# Backend Non-Functional Requirements

* Use **Express**, **Cors**, **Morgan** and **JSON parsing**
* Store data in an **in-memory array**
* Use proper **HTTP status codes**
* Use clear **error messages**
* Code should be readable and modular (router, store, server entry point)

---

# Frontend Requirements (Vue 3 + Vite)

Build a simple UI that interacts with the backend API.

## Features

### **1. Display Tasks**

* Fetch tasks from `/api/tasks`
* Display status, priority, and timestamp
* Sort newest -> oldest (optional - time factor)

### **2. Create Tasks**

* Provide a form to create tasks
* Perform minimal client-side validation (title req.)
* On success, append task to the list

### **3. Update Tasks**

* Ability to toggle `done`/`todo` via PATCH request
* Allow changing priority or status from the UI (optional - time factor)

### **4. Delete tasks**

* Delete tasks using the DELETE endpoint
* Confirm before deleting (optional)

### **5. Filters**

Provide a UI to:

* Filter by status
* Search task titles (case-insensitive)

### **6. UI States**

* Show **loading** indicator while fetching
* Show **error** message if API fails
* Show "no tasks found" message if filter/search returns no tasks

---

# Frontend Non-Functional Requirements

* Use Vue 3 Comp API
* Split UI into components (TaskList, TaskForm, TaskFilters etc.)
* Use standard fetch/axios for API calls
* Keep styling simple but clean (no framework)
* Code must be readable, modular and maintainable

---

# Project Structure

```
project/
  backend/
      src/
        index.js
        tasksRouter.js
        tasksStore.js
        errorMiddleware.js
  frontend/
    src/
      main.ts
      App.vue
      api.ts
      components/
        TaskList.vue
        TaskForm.vue
        TaskFilters.vue
```

---

# Running the App

## Backend

```
cd backend
npm install
npm run dev
```

## Frontend

```
cd frontend
npm install
npm run dev
```

---

# What I'm Testing & Practicing

* Clear, readable, maintainable code
* Functional API that operates correctly
* Ability to design frontend components
* Understanding of async flows and API integration
* Handling of edge cases
* Project structure
* Small details that I can fit in for polish (optional - time factor)

---

# What I'd like to aim to include

* Centralised error handling in Vue
* Component loading states
* Reusable API wrapper
* Status/priority colour badges
* "Mark all completed" button
* LocalStorage caching on frontend
* Improved styling

---
