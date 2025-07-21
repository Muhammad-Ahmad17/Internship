const axios = require('axios');

exports.sendWhatsAppMessage = async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await axios.post(
      'https://api.ultramsg.com/instance133667/messages/chat',
      null,
      {
        params: {
          token: 'notadiglaldofdqb',
          to,
          body: message
        }
      }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || 'Error sending message' });
  }
};