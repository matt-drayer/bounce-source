import { sendText } from 'services/server/sms';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';
import { PostRequestPayload } from 'constants/payloads/twilioSms';

export const config = {
  runtime: 'edge',
};

const POST = async (req: NextApiRequest) => {
  const payload: PostRequestPayload = req.body;
  try {
    await sendText({ phoneNumber: payload.phoneNumber, message: payload.message });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
