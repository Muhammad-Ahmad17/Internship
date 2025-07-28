// Import required modules
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'whatsapp-bot' }),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// Display QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Scan this QR code with your WhatsApp app.');
});

// When client is ready
client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');

    // Schedule a message every minute
    cron.schedule('* * * * *', async () => {
        const phoneNumber = '+923245959773'; // Replace with your target number
        const chatId = phoneNumber.replace('+', '') + '@c.us'; // Convert to WhatsApp format
        const message = '✅ Hello, this is an automated WhatsApp message!';

        try {
            await client.sendMessage(chatId, message);
            console.log('✅ Scheduled WhatsApp message sent!');
        } catch (err) {
            console.error('❌ Error sending scheduled WhatsApp message:', err.message);
        }
    });
});

// Log authentication status
client.on('authenticated', () => console.log('🔐 Authenticated successfully!'));
client.on('auth_failure', (msg) => console.error('❌ Authentication failed:', msg));
client.on('disconnected', (reason) => console.log('🔌 Disconnected:', reason));

// Start the client
client.initialize();
