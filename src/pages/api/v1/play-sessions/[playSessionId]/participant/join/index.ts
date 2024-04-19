import * as Sentry from '@sentry/nextjs';
import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import {
  PlaySessionParticipantStatusesEnum,
  PlaySessionStatusesEnum,
} from 'types/generated/server';
import { updateUserDefaultSport } from 'services/server/graphql/mutations/updateUserDefaultSport';
import { upsertPlaySessionParticipantJoin } from 'services/server/graphql/mutations/upsertPlaySessionParticipantJoin';
import { getPlaySessionById } from 'services/server/graphql/queries/getPlaySessionById';
import { triggerPlaySessionParticipantJoinNotification } from 'services/server/notifications/triggerPlaySessionParticipantJoinNotification';
import { adapterJoinPaySessionApi } from 'services/server/notifications/triggerPlaySessionParticipantJoinNotification/transformers';
import {
  response400BadRequestError,
  response401UnauthorizedError,
  response500ServerError,
  responseJson200Success,
} from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import {
  NextApiRequestWithViewerRequired,
  withViewerDataRequired,
} from 'utils/server/serverless/middleware/withViewerDataRequired';

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

    if (playSession.status !== PlaySessionStatusesEnum.Active) {
      const ERROR = 'Play session is not active';
      Sentry.captureException(new Error(ERROR));
      return response400BadRequestError(response, ERROR);
    }

    const participantLimit = playSession.participantLimit || 0;
    const isUnlimitedParticipants = participantLimit === 0;
    const activeParticipants = playSession.participantsAggregate?.aggregate?.count || 0;
    const doesHaveRoom =
      !activeParticipants || isUnlimitedParticipants || activeParticipants < participantLimit;

    if (!doesHaveRoom) {
      const ERROR = 'Play session is already full';
      Sentry.captureException(new Error(ERROR));
      return response400BadRequestError(response, ERROR);
    }

    console.log('viewer', viewer);
    console.log('playSession', playSession);
    console.log('playSessionId', playSessionId);

    const insertParticipantResponse = await upsertPlaySessionParticipantJoin({
      playSessionId,
      userId: viewer.id,
      addedByUserId: viewer.id,
      status: PlaySessionParticipantStatusesEnum.Active,
    });

    console.log('--- insertParticipantResponse = ', insertParticipantResponse);

    try {
      await Promise.all([
        insertParticipantResponse
          ? triggerPlaySessionParticipantJoinNotification(
              adapterJoinPaySessionApi({
                viewer,
                playSession,
                insertParticipantResponse,
              }),
            )
          : Promise.resolve(),
        updateUserDefaultSport({
          id: viewer.id,
          defaultSport: playSession.sport,
        }),
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
