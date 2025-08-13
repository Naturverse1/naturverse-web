import { Router } from 'express';

import { prisma } from '../db';

export const observations = Router();

observations.get('/', async (req, res) => {
  const rows = await prisma.observation.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows);
});

observations.post('/', async (req, res) => {
  try {
    const { title, notes } = req.body ?? {};
    if (!title || typeof title !== 'string')
      return res.status(400).json({ error: 'title is required' });
    const row = await prisma.observation.create({ data: { title, notes } });
    res.status(201).json(row);
  } catch (err) {
    console.error('create observation error:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});
