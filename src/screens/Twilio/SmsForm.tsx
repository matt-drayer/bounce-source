import React, { useState } from 'react';
import { PostRequestPayload } from 'constants/payloads/twilioSms';
import { useApiGateway } from 'hooks/useApi';

export default function SmsForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { post: sendSms } = useApiGateway<PostRequestPayload>('/v1/send-sms');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendSms({ payload: { phoneNumber, message } });
    } catch (error) {
      console.error('Error sending SMS:', error);
      setError('Failed to send SMS');
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Send SMS</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="mb-1 block text-sm font-semibold">
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="mb-1 block text-sm font-semibold">
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-600"
        >
          {loading ? 'Sending...' : 'Send SMS'}
        </button>
      </form>
    </div>
  );
}
