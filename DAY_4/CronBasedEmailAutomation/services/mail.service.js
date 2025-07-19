const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true, // use TLS
    host: 'smtp.gmail.com', // or your email provider's SMTP server
    port: 465, // usually 465 for secure SMTP
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password (not real password!)
    }
});

exports.sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) { 
        console.error('Error sending email:', error);
    }
};




