import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const processes = [
  { name: 'API server', args: ['server/index.js'] },
  { name: 'Vite', args: ['node_modules/vite/bin/vite.js'] }
].map(({ name, args }) => ({
  name,
  child: spawn(process.execPath, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit'
  })
}));

let shuttingDown = false;

function stopAll(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  for (const { child } of processes) {
    if (child.exitCode === null && !child.killed) child.kill();
  }
}

for (const { name, child } of processes) {
  child.on('error', (error) => {
    console.error(`${name} failed to start: ${error.message}`);
    if (name === 'Vite') stopAll(1);
  });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    const reason = signal ? `signal ${signal}` : `exit code ${code}`;
    if (name === 'API server') {
      console.error(`API server stopped (${reason}). Check MongoDB availability and MONGODB_URI in .env.`);
      return;
    }
    if (code !== 0 || signal) console.error(`${name} stopped unexpectedly (${reason}).`);
    stopAll(code ?? 1);
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
