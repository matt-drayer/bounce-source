import { format } from 'date-fns';
import { GetActiveJoinedPlaySessionsQuery, GetPlaySessionFeedQuery } from 'types/generated/client';
import { getImageUrl } from 'services/client/cloudflare/getImageUrl';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';
import { Props } from './props';

const HACK_OVERRIDE_IMAGES = [
  '49873bcc-48d1-40a1-9c70-f133177475ca',
  '365edf1d-3843-44f0-bc79-717057e8a8e0',
];

const getPlaySessionDate = ({
  startDateTime,
  locale = 'en-US',
}: {
  startDateTime: string;
  locale?: string;
}) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short', // "short" for abbreviated month name
    day: 'numeric', // numeric day
  });

  const formattedDate = formatter.format(new Date(startDateTime));
  return formattedDate;
};

export const transformPlaySessionFeedToProps = (
  playSession: GetPlaySessionFeedQuery['playSessions'][0],
): Props => {
  let image = '';

  if (
    HACK_OVERRIDE_IMAGES.includes(playSession?.venue?.id) &&
    playSession?.venue?.images?.[0]?.url
  ) {
    image = getImageUrl({
      url: playSession.venue.images[0].url,
      path: playSession.venue.images[0].path,
    });
  }

  return {
    imageUrl: image,
    title: playSession.title,
    startTime: format(new Date(playSession.startDateTime), 'p'),
    endTime: format(new Date(playSession.endDateTime), 'p'),
    courtName: playSession?.venue?.title || '',
    participantCount: playSession.participantsAggregate?.aggregate?.count || 0,
    participantLimit: playSession.participantLimit,
    organizerName: playSession.organizerProfile?.fullName || '',
    isParticipant: !!playSession?.currentUserAsParticipant?.length,
    commentCount: playSession.commentsAggregate?.aggregate?.count || 0,
    skillRatingMaximum: playSession.skillRatingMaximum,
    skillRatingMinimum: playSession.skillRatingMinimum,
    date: getPlaySessionDate({
      startDateTime: playSession.startDateTime,
      locale: getNavigatorLanguage(),
    }),
  };
};

export const transformMyPlaySessionsToProps = (
  playSession: GetActiveJoinedPlaySessionsQuery['playSessionParticipants'][0]['playSession'],
): Props => {
  let image = '';

  if (
    HACK_OVERRIDE_IMAGES.includes(playSession?.venue?.id) &&
    playSession?.venue?.images?.[0]?.url
  ) {
    image = getImageUrl({
      url: playSession.venue.images[0].url,
      path: playSession.venue.images[0].path,
    });
  }

  return {
    imageUrl: image,
    title: playSession.title,
    startTime: format(new Date(playSession.startDateTime), 'p'),
    endTime: format(new Date(playSession.endDateTime), 'p'),
    courtName: playSession?.venue?.title || '',
    participantCount: playSession.participantsAggregate?.aggregate?.count || 0,
    participantLimit: playSession.participantLimit,
    organizerName: playSession.organizerProfile?.fullName || '',
    isParticipant: true,
    commentCount: playSession.commentsAggregate?.aggregate?.count || 0,
    skillRatingMaximum: playSession.skillRatingMaximum,
    skillRatingMinimum: playSession.skillRatingMinimum,
    date: getPlaySessionDate({
      startDateTime: playSession.startDateTime,
      locale: getNavigatorLanguage(),
    }),
  };
};
