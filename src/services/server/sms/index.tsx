import { TWILIO_PHONE_NUMBER } from 'constants/twilio';
import { sendSms } from 'services/server/twilio';

interface TextMessageData {
  phoneNumber: string;
  message: string;
}

export async function sendText(data: TextMessageData) {
  try {
    const messageData = {
      body: data.message,
      from: TWILIO_PHONE_NUMBER,
      to: data.phoneNumber,
    };

    const response = await sendSms(messageData);
    return response;
  } catch (error) {
    console.error('Error sending text:', error);
    throw error;
  }
}
