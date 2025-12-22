module.exports = {
  apps: [
    {
      name: 'call-center-backend',
      script: 'backend/dist/main.js',
      cwd: '/var/www/call-center',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/pm2/call-center-backend-error.log',
      out_file: '/var/log/pm2/call-center-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
    },
    {
      name: 'call-center-frontend',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 4001',
      cwd: '/var/www/call-center/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
      error_file: '/var/log/pm2/call-center-frontend-error.log',
      out_file: '/var/log/pm2/call-center-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '200M',
    },
  ],
};

