import { Request, Response } from 'express';
import { getDashboardData } from './dashboard.service';
import { onDashboardUpdate } from './dashboard.sse';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getDashboardData(req.user!.id);
  sendSuccess(res, data, 'Dashboard data retrieved');
});

export async function dashboardEvents(req: Request, res: Response) {
  const userId = req.user!.id;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write('data: {"type":"connected"}\n\n');

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30_000);

  const unsubscribe = onDashboardUpdate(userId, () => {
    res.write(`data: {"type":"dashboard:update","timestamp":"${new Date().toISOString()}"}\n\n`);
  });

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
