import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import { PlaySessionParticipantStatusesEnum } from 'types/generated/server';
import { upsertPlaySessionParticipantLeave } from 'services/server/graphql/mutations/upsertPlaySessionParticipantLeave';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
import { triggerPlaySessionParticipantLeftNotification } from 'services/server/notifications/triggerPlaySessionParticipantLeftNotification';
import { adapterParticipantLeftApi } from 'services/server/notifications/triggerPlaySessionParticipantLeftNotification/transformers';
import {
  response401UnauthorizedError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';
import { HttpMethods } from 'constants/http';

const POST = async function (request: NextApiRequestWithViewerRequired, response: NextApiResponse) {
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

    if (!playSession) {
      const ERROR = 'Invalid play session';
      Sentry.captureException(new Error(ERROR));
      return response401UnauthorizedError(response, ERROR);
    }

    const viewerAsParticipant = playSession.participants?.find(
      (participant) => participant.userId === viewer.id,
    );

    if (
      !viewerAsParticipant ||
      viewerAsParticipant.status !== PlaySessionParticipantStatusesEnum.Active
    ) {
      return responseJson200Success(response, {
        success: true,
      });
    }

    const insertParticipantResponse = await upsertPlaySessionParticipantLeave({
      playSessionId,
      userId: viewer.id,
      status: PlaySessionParticipantStatusesEnum.Inactive,
    });

    console.log('--- insertParticipantResponse = ', insertParticipantResponse);

    try {
      await Promise.all([
        triggerPlaySessionParticipantLeftNotification(
          adapterParticipantLeftApi({
            playSession,
            insertParticipantResponse,
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

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
