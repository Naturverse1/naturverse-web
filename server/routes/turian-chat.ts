import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  const { message } = req.body as { message?: string };
  return res.status(200).json({ reply: `Turian heard: ${message}` });
});

export default router;
