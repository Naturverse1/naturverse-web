import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from '../lib/api';

export default function Todos() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => api('/api/todos'),
  });

  const addTodo = useMutation({
    mutationFn: (text: string) =>
      api('/api/todos', { method: 'POST', body: JSON.stringify({ text }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const patchTodo = useMutation({
    mutationFn: ({ id, ...body }: { id: string; done?: boolean; text?: string }) =>
      api(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => api(`/api/todos/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const [text, setText] = useState('');

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error + ''}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Todos</h2>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          addTodo.mutate(text);
          setText('');
        }}
      >
        <input
          className="border rounded px-2 py-1 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
        />
        <button
          className="bg-card text-card-foreground border rounded px-3 py-1"
          type="submit"
          disabled={addTodo.isPending}
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {data.items.map((todo: any) => (
          <li key={todo.id} className="border rounded p-2 flex items-center gap-2 bg-card">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => patchTodo.mutate({ id: todo.id, done: !todo.done })}
            />
            <span className={todo.done ? 'line-through opacity-60' : ''}>{todo.text}</span>
            <button
              className="ml-auto text-red-500 border rounded px-2 py-1"
              onClick={() => deleteTodo.mutate(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
