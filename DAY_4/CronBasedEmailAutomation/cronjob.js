require('dotenv').config();
const cron = require('node-cron');
const { sendEmail } = require('./services/mail.service');



cron.schedule('* * * * *', async () => {
    console.log(`cron job running at ${new Date().toLocaleTimeString()}`);
    await sendEmail('ahmadbro1343@gmail.com', 'Cron Job Alert!', `Update your system, ASAP!`);
});

// let in schemma thers an attribute which mnitors apps version and if it is not updated it will 
// first retrive all of those users who have not updated their app and then send them an email