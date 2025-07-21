const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true, 
    host: 'smtp.gmail.com', 
    port: 465, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
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
        // transporter.sendMail(mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) { 
        console.error('Error sending email:', error);
    }
};




