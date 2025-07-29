const express = require('express');
const pThrottle = require('p-throttle').default;

const app = express();
const PORT = 5000;

// Throttle: allow 1 email per 1000ms
const throttle = pThrottle({
  limit: 1,
  interval: 1000, // 1 second
});

// Dummy email sender
async function sendEmail({ name, email }) {
  console.log(`📧 Sending email to ${name} <${email}>`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Email sent to ${email}`);
      resolve();
    }, 100); // Simulate sending delay
  });
}

// Throttled version of the sender
const throttledSendEmail = throttle(sendEmail);

// Route to send mock emails
app.post('/api/send-mock-emails', async (req, res) => {
  const mockUsers = [];

  // Generate 10 mock users with example emails
  for (let i = 1; i <= 10; i++) {
    mockUsers.push({
      name: `User${i}`,
      email: `user${String(i).padStart(3, '0')}@example.com`
    });
  }

  try {
    for (const user of mockUsers) {
      await throttledSendEmail(user);
    }
    res.status(200).json({
      message: '✅ Mock emails sent successfully!',
      sentTo: mockUsers.map(u => u.email)
    });
  } catch (err) {
    console.error('❌ Error sending mock emails:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Root for testing
app.get('/', (req, res) => {
  res.send('🚀 Mock Email Server is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
