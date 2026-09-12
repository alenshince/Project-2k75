import { Router, type Request, type Response } from 'express';

const router = Router();

// In-memory telemetry log buffer
interface ScanLogEntry {
  id: string;
  catalogIndex: number;
  designation: string;
  timestamp: string;
  anomalyDetected: boolean;
  status: 'COMMITTED' | 'FAILED' | 'REVERTED';
}

const scanLogs: ScanLogEntry[] = [];

// Sample catalog highlights
const catalogHighlights = [
  { catalogIndex: 1, designation: 'AKSHAYA-PRIME', archetype: 'Bureaucratic Administrative Hub', habitabilityScore: 78 },
  { catalogIndex: 2, designation: 'MINNAL-KSRTC', archetype: 'High-Velocity Rogue-Class', habitabilityScore: 12 },
  { catalogIndex: 3, designation: 'PANCHAYAT-OBELISK', archetype: 'Stagnant Civil Monolith', habitabilityScore: 65 },
  { catalogIndex: 75, designation: 'DOOMSNEXUS', archetype: 'Synthetic Singularity Core', habitabilityScore: 0 },
];

// GET /api/telemetry/planets - Retrieve catalog summary
router.get('/planets', (_req: Request, res: Response) => {
  res.json({
    totalCount: 75,
    summary: catalogHighlights,
    lastScanned: scanLogs.length > 0 ? scanLogs[scanLogs.length - 1] : null,
  });
});

// POST /api/telemetry/scan - Record a completed planetary scan
router.post('/scan', (req: Request, res: Response) => {
  const { catalogIndex, designation, anomalyDetected = false } = req.body;

  if (typeof catalogIndex !== 'number' || !designation) {
    res.status(400).json({ error: 'Missing required fields: catalogIndex (number), designation (string)' });
    return;
  }

  const newLog: ScanLogEntry = {
    id: `SCAN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    catalogIndex,
    designation: String(designation),
    timestamp: new Date().toISOString(),
    anomalyDetected: Boolean(anomalyDetected),
    status: designation === 'DOOMSNEXUS' ? 'FAILED' : 'COMMITTED',
  };

  scanLogs.push(newLog);

  res.status(201).json({
    message: designation === 'DOOMSNEXUS' ? 'FATAL_CORRUPTION_EVENT_DETECTED' : 'TELEMETRY_LOGGED_SUCCESSFULLY',
    entry: newLog,
  });
});

// GET /api/telemetry/logs - Retrieve scan history
router.get('/logs', (_req: Request, res: Response) => {
  res.json({
    count: scanLogs.length,
    logs: scanLogs.slice(-20), // Last 20 scans
  });
});

export default router;
