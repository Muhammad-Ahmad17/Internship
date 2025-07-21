const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('✅ Cron job executed every minute');
  // Place your logic here (e.g., send email, clean DB, call API)
});
