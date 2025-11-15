import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting frontend and backend servers...\n');

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: { ...process.env }
});

// Start backend
const backend = spawn('python', ['backend/app.py'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: { ...process.env }
});

// Handle process termination
const cleanup = () => {
  console.log('\n🛑 Shutting down servers...');
  frontend.kill('SIGTERM');
  backend.kill('SIGTERM');
  setTimeout(() => {
    frontend.kill('SIGKILL');
    backend.kill('SIGKILL');
    process.exit();
  }, 2000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Handle errors
frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err.message);
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err.message);
});

// Handle exit
frontend.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`Frontend exited with code ${code}`);
  }
});

backend.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`Backend exited with code ${code}`);
  }
});

