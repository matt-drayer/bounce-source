import * as React from 'react';
import {
  EventPrivacyEnum,
  EventStatusesEnum,
  EventTypesEnum,
  GetEventDetailsQuery,
  SportsEnum,
} from 'types/generated/client';
import { buildTournamentEventName } from 'utils/shared/string/buildTournamentEventName';
import { BasicForm } from 'utils/shared/string/tournamentBuilder';
import { EventFormItem } from 'utils/shared/string/tournamentBuilder';
import { eventTypeEnumToString } from 'utils/shared/string/tournamentBuilder';
import { getNavigatorLanguage } from 'utils/shared/time/getNavigatorLanguage';
import TournamentContent from 'screens/TournamentDetails/TournamentContent';

type Event = Exclude<GetEventDetailsQuery['eventsByPk'], null | undefined>;
type Groups = Event['groups'];

type Props = {
  data: BasicForm & {
    eventGroups: EventFormItem[];
  };
};

const IS_TEST_IN_USA = true;

const mapFormToEventGroups = (groups: EventFormItem[]): Groups => {
  return groups.map((eventGroup, id) => {
    return {
      id: id,
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
      registrations: [],
      title: buildTournamentEventName({
        eventType: eventTypeEnumToString(eventGroup.eventType),
        gender: eventGroup.gender,
        maxRating: eventGroup.maxRating,
        minRating: eventGroup.minRating,
      }),
      totalPoints: eventGroup.totalPoints,
      winBy: eventGroup.winBy,
      teams: [],
    };
  });
};

const Review = (props: Props) => {
  const { data } = props;

  return (
    <TournamentContent
      jsonLd={''}
      isReview
      faqs={data.faqs}
      event={{
        createdAt: new Date().toISOString(),
        coverImageUrl: URL.createObjectURL(data.banner),
        type: EventTypesEnum.Tournament,
        addressString: data.venue.addressString,
        venue: data.venue as any,
        ballType: data.ball,
        description: data.overview,
        coverImageFileName: data.banner.name,
        startDate: data.from.toISOString().split('T')[0],
        endDate: data.to.toISOString().split('T')[0],
        startDateTime: data.from.toISOString(),
        endDateTime: data.to.toISOString(),
        registrationPriceUnitAmount: data.registrationFee * 100,
        currency: 'USD',
        registrations: [],
        title: data.title,
        isExternal: false,
        groups: [],
        locale: getNavigatorLanguage(IS_TEST_IN_USA ? 'en-US' : ''),
        hasPrizes: data.hasPrizes,
        isSanctioned: data.sanctioned,
        privacy: data.private ? EventPrivacyEnum.Private : EventPrivacyEnum.Public,
        sport: SportsEnum.Pickleball,
        isRatingRequired: false,
        status: EventStatusesEnum.Draft,
        timezoneName: data.venue.timezone,
        registrationDeadlineDate: data.registrationDeadline.toISOString().split('T')[0],
        registrationDeadlineDateTime: data.registrationDeadline.toISOString(),
        faqs: data.faqs.map((faq, id) => ({ id, ...faq })),
        /**
         * @todo replace with anything?
         */
        id: 'new',
        slug: '',
        prizeDescription: '',
        timezoneAbbreviation: '',
        sourceRegistrationCount: 0,
        ballCustomName: '',
        timezoneOffsetMinutes: 0,
        displayLocation: '',
        scoringFormat: data.eventGroups[0].scoringType,
      }}
      eventGroups={mapFormToEventGroups(data.eventGroups)}
    />
  );
};

export default Review;
