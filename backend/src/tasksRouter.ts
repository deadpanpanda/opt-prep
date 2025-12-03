import express, { Request, Response } from "express";
import * as store from "./tasksStore.js";
import type { CreateTaskData, UpdateTaskData } from "./tasksStore.js";

const router = express.Router();

const VALID_STATUSES = ["todo", "in-progress", "done"] as const;
const VALID_PRIORITIES = ["low", "medium", "high"] as const;

function validateTask(
  data: Partial<CreateTaskData | UpdateTaskData>,
  isUpdate = false
): string[] {
  const errors: string[] = [];

  if (!isUpdate && (!data.title || !data.title.trim())) {
    errors.push("Title is required");
  }

  if (data.status && !VALID_STATUSES.includes(data.status as any)) {
    errors.push(`Status must be: ${VALID_STATUSES.join(", ")}`);
  }

  if (data.priority && !VALID_PRIORITIES.includes(data.priority as any)) {
    errors.push(`Priority must be: ${VALID_PRIORITIES.join(", ")}`);
  }

  return errors;
}

router.get("/", (req: Request, res: Response) => {
  const { status, search } = req.query;
  const tasks = store.getAllTasks({
    status: status as string,
    search: search as string,
  });
  res.json(tasks);
});

router.get("/:id", (req: Request, res: Response) => {
  const task = store.getTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.post("/", (req: Request, res: Response) => {
  const errors = validateTask(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });

  const newTask = store.createTask(req.body as CreateTaskData);
  res.status(201).json(newTask);
});

router.patch("/:id", (req: Request, res: Response) => {
  const errors = validateTask(req.body, true);
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });

  const updated = store.updateTask(req.params.id, req.body as UpdateTaskData);
  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json(updated);
});

router.delete("/:id", (req: Request, res: Response) => {
  const deleted = store.deleteTask(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Task not found" });
});

export default router;
