import cronWorker from './cron.worker';

// Start the cron worker
cronWorker.start();

// Keep the process alive
console.log('Cron worker started. Press Ctrl+C to stop.');
process.on('SIGINT', () => {
  console.log('Stopping cron worker...');
  cronWorker.stop();
  process.exit(0);
});

// Keep process alive
setInterval(() => {}, 1000);

