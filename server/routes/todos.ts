import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const todos: Todo[] = [];

const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
});

type Todo = z.infer<typeof TodoSchema>;

const CreateTodoSchema = z.object({ text: z.string().min(1) });
const UpdateTodoSchema = z.object({ done: z.boolean().optional(), text: z.string().optional() });

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: todos });
});

router.post('/', (req, res) => {
  const parse = CreateTodoSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.message });
  const todo: Todo = {
    id: nanoid(),
    text: parse.data.text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  res.json(todo);
});

router.patch('/:id', (req, res) => {
  const parse = UpdateTodoSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.message });
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  if (parse.data.text !== undefined) todo.text = parse.data.text;
  if (parse.data.done !== undefined) todo.done = parse.data.done;
  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const idx = todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(idx, 1);
  res.json({ ok: true });
});

export default router;
