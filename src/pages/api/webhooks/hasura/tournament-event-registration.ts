import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import { EventTriggerPayload } from 'constants/hasura';
import { HttpMethods } from 'constants/http';
import { getEventGroupRegistrationForAlert } from 'services/server/graphql/queries/getEventGroupRegistrationForAlert';
import { response500ServerError, responseJson200Success } from 'utils/server/edge/http';
import { withHttpMethods } from 'utils/server/edge/middleware/withHttpMethods';

export const config = {
  runtime: 'edge',
};

const POST = async (req: NextRequest) => {
  try {
    /**
     * @todo Abstract webhook secret check to a middleware
     */
    const webhookSecret = req.headers.get('webhook-secret');

    console.log(1);
    if (webhookSecret !== process.env.HASURA_WEBHOOK_SECRET) {
      console.log(2);
      console.log('!!!! WH SECRET DOES NOT MATCH', webhookSecret);
      Sentry.captureException(new Error('Webhook secret does not match'));
      return responseJson200Success(req, { success: false });
    }

    const body = (await req.json()) as EventTriggerPayload<{
      id: string;
    }>;
    const insertedData = body.event.data.new;

    if (!insertedData?.id) {
      return responseJson200Success(req, { success: false });
    }

    const registrationData = await getEventGroupRegistrationForAlert({
      id: insertedData.id,
    });

    await fetch('https://eo4pc7hrjzh4qfl.m.pipedream.net', {
      method: 'POST',
      body: JSON.stringify(registrationData.eventGroupRegistrationsByPk),
    });

    return responseJson200Success(req, {
      success: true,
    });
  } catch (error) {
    const date = new Date().toISOString();
    console.log('+++++ ERROR:', error);
    Sentry.captureException(error);
    return response500ServerError(req, 'There was an error processing the webhook at ' + date);
  }
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
