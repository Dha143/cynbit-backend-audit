# Recommended Improvements - With Code

## 1. API Gateway with Rate Limiting + Validation + Security Headers

```javascript
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';

const app = express();

// Security Headers - Fixes missing CSP, HSTS, X-Frame
app.use(helmet()); 
app.use(express.json());

// Rate Limiter - Fixes HIGH security issue
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 'RATE_LIMITED', message: 'Too many requests' }
});

// Zod Validation - Fixes XSS + Data validation
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2),
  message: z.string().min(10).max(2000)
});

app.post('/api/v1/leads', limiter, (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: 'VALIDATION_ERROR', errors: parsed.error.flatten() });
  
  // Use queue instead of direct DB to prevent overload
  // await leadQueue.add(parsed.data);
  
  return res.status(202).json({ code: 'ACCEPTED', traceId: `req_${Date.now()}` });
});

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.listen(3000);
