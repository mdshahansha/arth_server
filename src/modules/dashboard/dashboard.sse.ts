import { EventEmitter } from 'events';

const dashboardEmitter = new EventEmitter();
dashboardEmitter.setMaxListeners(100);

export function emitDashboardUpdate(userId: string) {
  dashboardEmitter.emit(`update:${userId}`);
}

export function onDashboardUpdate(userId: string, listener: () => void) {
  dashboardEmitter.on(`update:${userId}`, listener);
  return () => {
    dashboardEmitter.off(`update:${userId}`, listener);
  };
}
