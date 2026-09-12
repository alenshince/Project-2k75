import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';
import telemetryRouter from './routes/telemetry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/telemetry', telemetryRouter);

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Project 2K75 Backend API',
    endpoints: [
      'GET /api/health',
      'GET /api/telemetry/planets',
      'POST /api/telemetry/scan',
      'GET /api/telemetry/logs',
    ],
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`📡 Project 2K75 Backend Online`);
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
