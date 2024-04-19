import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetTournamentsForMarketplaceQuery } from 'types/generated/server';
import client from 'services/server/graphql/client';

const QUERY = gql`
  query getTournamentsForMarketplace {
    events(
      where: {
        archivedAt: { _isNull: true }
        deletedAt: { _isNull: true }
        privacy: { _eq: PUBLIC }
        type: { _eq: TOURNAMENT }
        startDateTime: { _gte: "now()" }
        status: { _eq: PUBLISHED }
      }
    ) {
      city {
        name
        id
        countrySubdivision {
          name
          id
          code
        }
        timezone
      }
      coverImagePath
      displayLocation
      endDateTime
      hasPrizes
      id
      latitude
      locale
      longitude
      organizerImagePath
      registrationClosedAt
      registrationDeadlineDate
      registrationPriceUnitAmount
      scoringFormat
      slug
      isExternal
      sourceRegistrationCount
      sourceOrganizerTitle
      startDateTime
      status
      timezoneAbbreviation
      timezoneName
      timezoneOffsetMinutes
      title
      registrationsAggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const getTournamentsForMarketplace = async () => {
  const data = await client.request<GetTournamentsForMarketplaceQuery>(print(QUERY));
  return data;
};
