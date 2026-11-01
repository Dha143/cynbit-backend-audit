import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';

const app = express();
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { code: 'RATE_LIMITED', message: 'Too many requests' }
});

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2),
  message: z.string().min(10).max(2000)
});

app.post('/api/v1/leads', limiter, (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: 'VALIDATION_ERROR', errors: parsed.error.flatten() });
  return res.status(202).json({ code: 'ACCEPTED', traceId: Date.now() });
});

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.listen(3000, () => console.log('Secure Gateway running on :3000'));
