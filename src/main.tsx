import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(<RouterProvider router={router} />);
