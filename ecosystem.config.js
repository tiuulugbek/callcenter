const path = require('path');
const projectRoot = __dirname;

module.exports = {
  apps: [
    {
      name: 'call-center-backend',
      script: path.join(projectRoot, 'backend/dist/main.js'),
      cwd: projectRoot,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: path.join(projectRoot, 'logs/backend-error.log'),
      out_file: path.join(projectRoot, 'logs/backend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
    {
      name: 'call-center-frontend',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 4001 --strictPort',
      cwd: path.join(projectRoot, 'frontend'),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
      error_file: path.join(projectRoot, 'logs/frontend-error.log'),
      out_file: path.join(projectRoot, 'logs/frontend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '200M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};

