import Twilio from 'twilio';

const twilioClient = Twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
});

interface MessageData {
  body: string;
  to: string;
  from: string;
}

async function sendSms(data: MessageData) {
  try {
    const response = await twilioClient.messages.create(data);
    console.log('Message sent successfully:', response.sid);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export { sendSms };
