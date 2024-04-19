import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import { PlaySessionStatusesEnum } from 'types/generated/server';
import { updatePlaySessionAsCanceled } from 'services/server/graphql/mutations/updatePlaySessionAsCanceled';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
import { triggerPlaySessionCanceledNotification } from 'services/server/notifications/triggerPlaySessionCanceledNotification';
import { adapterOrganizerCancelApi } from 'services/server/notifications/triggerPlaySessionCanceledNotification/transformers';
import { allowCors } from 'utils/server/serverless/http';
import {
  response401UnauthorizedError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';

const handler = async function (
  request: NextApiRequestWithViewerRequired,
  response: NextApiResponse,
) {
  try {
    const viewer = request.viewer;
    const { playSessionId } = request.query;

    if (!playSessionId) {
      const ERROR = 'Invalid play session ID';
      Sentry.captureException(new Error(ERROR));
      return response401UnauthorizedError(response, ERROR);
    }

    const playSessionResponse = await getPlaySessionById({ id: playSessionId });
    const playSession = playSessionResponse?.playSessionsByPk;

    console.log(playSession);

    if (!playSession) {
      const ERROR = 'Invalid play session';
      Sentry.captureException(new Error(ERROR));
      return response401UnauthorizedError(response, ERROR);
    }

    if (playSession.status !== PlaySessionStatusesEnum.Active) {
      return responseJson200Success(response, {
        success: true,
      });
    }

    if (playSession.organizerUserId !== viewer.id) {
      const ERROR = 'Unauthorized';
      Sentry.captureException(new Error(ERROR));
      return response401UnauthorizedError(response, ERROR);
    }

    await updatePlaySessionAsCanceled({
      id: playSessionId,
    });

    try {
      await Promise.all([
        triggerPlaySessionCanceledNotification(
          adapterOrganizerCancelApi({
            playSession,
          }),
        ),
      ]);
    } catch (error) {
      Sentry.captureException(error);
    }

    return responseJson200Success(response, {
      success: true,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.log('--- ERROR = ', error);
    return response500ServerError(response, 'There was an error. Refresh the page and try again.');
  }
};

export default allowCors(
  // @ts-ignore it should be right
  withViewerDataRequired(handler),
);
