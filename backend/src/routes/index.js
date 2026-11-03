import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NganHa Herbal Shop API Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

