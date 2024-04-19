import { NextApiResponse } from 'next';
import slugify from 'slugify';
import { HttpMethods } from 'constants/http';
import { EventCreatePayload } from 'constants/payloads/events';
import { BallTypesEnum } from 'types/generated/client';
import { EventTypesEnum, ScoringFormatEnum } from 'types/generated/server';
import { EventStatusesEnum } from 'types/generated/server';
import { SportsEnum } from 'types/generated/server';
import { EventGroupsInsertInput } from 'types/generated/server';
import { EventPrivacyEnum } from 'types/generated/server';
import { insertEvent } from 'services/server/graphql/mutations/events/insertEvent';
import { insertEventFaqs } from 'services/server/graphql/mutations/events/insertEventFaqs';
import { insertEventGroups } from 'services/server/graphql/mutations/events/insertEventGroup';
import { insertEventSponsors } from 'services/server/graphql/mutations/events/insertEventSponsors';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';
import { withViewerDataRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';
import { buildTournamentEventName } from 'utils/shared/string/buildTournamentEventName';
import { eventTypeEnumToString } from 'utils/shared/string/tournamentBuilder';
import { getTimezoneAbbreviation } from 'utils/shared/time/getTimezoneAbbreviation';
import { getTimezoneOffsetMinutes } from 'utils/shared/time/getTimezoneOffsetMinutes';

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const viewer = req.viewer;

  const body = req.body as EventCreatePayload;

  const { insertEventsOne: event } = await insertEvent({
    object: {
      hostUserId: viewer.id,
      ballType: body.ball || BallTypesEnum.NotSelected,
      coverImageFileName: body.banner.fileName,
      coverImageFileType: body.banner.fileType,
      coverImageHost: body.banner.fileType,
      coverImageOriginalFileName: body.banner.originalFileName,
      coverImagePath: body.banner.path,
      coverImageProviderUrl: body.banner.providerUrl,
      coverImageProvider: body.banner.provider,
      coverImageUrl: body.banner.url,
      title: body.title,
      type: EventTypesEnum.Tournament,
      venueId: body.venue.id,
      slug: slugify(body.title, { lower: true, trim: true, strict: true }),
      startDate: body.from,
      endDate: body.to,
      registrationDeadlineDate: body.registrationDeadline,
      ballCustomName: '',
      cityId: body.venue.city?.id,
      timezoneName: body.venue.timezone,
      timezoneAbbreviation: getTimezoneAbbreviation(body.venue.timezone),
      timezoneOffsetMinutes: getTimezoneOffsetMinutes(body.venue.timezone),
      status: EventStatusesEnum.Published,
      privacy: EventPrivacyEnum.Public,
      displayLocation: `${body.venue.city?.name}, ${body.venue.city?.countrySubdivision.name}`,
      addressString: body.venue.addressString,
      sport: SportsEnum.Pickleball,
      registrationPriceUnitAmount: body.registrationFee,
      hasPrizes: body.hasPrizes,
      isSanctioned: body.sanctioned,
      scoringFormat: ScoringFormatEnum.Traditional,
      isRatingRequired: false,
      isExternal: false,
      startDateTime: body.startDateTime,
      endDateTime: body.endDateTime,
      cancelReason: '',
      deletedAt: null,
      archivedAt: null,
    },
  });

  const [faqs, sponsors] = await Promise.all([
    insertEventFaqs({
      objects: body.faqs.map((item: any) => ({
        ...item,
        eventId: event.id,
      })),
    }),

    insertEventSponsors({
      objects: body.sponsors.map((item: any) => ({
        isTitleSponsor: item.isFeatured,
        name: item.name,
        eventId: event.id,
        imagePath: item.path,
        imageFileName: item.fileName,
        imageHost: item.host,
        imageUrl: item.url,
        imageProvider: item.provider,
        imageProviderUrl: item.providerUrl,
        imageFileType: item.fileType,
      })),
    }),
  ]);

  const eventGroupsInput: EventGroupsInsertInput[] = body.eventGroups.map((eventGroup) => ({
    eventId: event.id,
    gender: eventGroup.gender,
    minimumRating: eventGroup.minRating,
    maximumRating: eventGroup.maxRating,
    minimumAge: eventGroup.minAge,
    maximumAge: eventGroup.maxRating,
    startsAt: eventGroup.timeSlotFrom,
    endsAt: eventGroup.timeSlotTo,
    format: eventGroup.eventFormat,
    formatCustomName: '',
    teamLimit: eventGroup.maxNumOfTeams,
    teamType: eventGroup.eventType,
    gamesPerMatch: eventGroup.gamePerMatch,
    minimumNumberOfGames: eventGroup.minGamesNumber,
    priceUnitAmount: eventGroup.eventFee,
    scoringFormat: eventGroup.scoringType,
    title: buildTournamentEventName({
      eventType: eventTypeEnumToString(eventGroup.eventType),
      gender: eventGroup.gender,
      maxRating: eventGroup.maxRating,
      minRating: eventGroup.minRating,
    }),
    totalPoints: eventGroup.totalPoints,
    winBy: eventGroup.winBy,
  }));

  const { insertEventGroups: eventGroup } = await insertEventGroups({
    objects: eventGroupsInput,
  });

  return responseJson200Success(res, { event, faqs, eventGroup });
};

export default withHttpMethods({
  [HttpMethods.Post]: withViewerDataRequired(POST),
});
