require('dotenv').config();
const cron = require('node-cron');
const { sendEmail } = require('./services/mail.service');



cron.schedule('* * * * * ', async () => {
    console.log(`cron job running at ${new Date().toLocaleTimeString()}`);
    await sendEmail('ahmadbro1343@gmail.com', 'Cron Job Alert!', `Update your system, ASAP!`);
});

// let in schemma thers an attribute which mnitors apps version and if it is not updated it will 
// first retrive all of those users who have not updated their app and then send them an email

/**
 * * * * * command_to_run
| | | | |
| | | | └──── Day of the week (0 - 7) (Sunday = 0 or 7)
| | | └────── Month (1 - 12)
| | └──────── Day of the month (1 - 31)
| └────────── Hour (0 - 23)
└──────────── Minute (0 - 59)
 */