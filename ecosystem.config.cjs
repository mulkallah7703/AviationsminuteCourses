module.exports = {
  apps: [
    {
      name: 'aviation-lms-api',
      cwd: __dirname,
      script: 'backend/src/index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
}
