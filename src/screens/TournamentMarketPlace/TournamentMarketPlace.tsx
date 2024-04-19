import React, { useState } from 'react';
import { addDays, isBefore, startOfDay } from 'date-fns';
import {
  CompetitionGenderEnum,
  EventGroupFormatsEnum,
  TeamTypesEnum,
} from 'types/generated/client';
import { calculateHaversineDistance } from 'utils/shared/geo/calculateHaversineDistance';
import { convertUnitPriceToFormattedPrice } from 'utils/shared/money/convertUnitPriceToFormattedPrice';
import { useGeoLocation } from 'hooks/useGeoLocation';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Footer from 'components/Footer';
import Head from 'components/utilities/Head';
import FilterBar from './FilterBar';
import TournamentList from './TournamentList';
import {
  GetTournamentsForMarketplaceQuery,
  MAXIMUM_AGE,
  MAXIMUM_COST,
  MINIMUM_AGE,
  MINIMUM_COST,
  TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS,
} from './types';

const INITIAL_PAGE_SIZE = 25;

function formatDateRange(startDate: Date, endDate: Date): string {
  // Formatter for the full date
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Formatter for the month and day
  const monthDayFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
  });

  // Check if start and end dates are the same day in the user's timezone
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  if (isSameDay) {
    // Format as a single date
    return dateFormatter.format(startDate);
  } else {
    // Format as a date range
    return `${monthDayFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`;
  }
}

export default function TournamentMarketplace({
  tournaments,
}: {
  tournaments: GetTournamentsForMarketplaceQuery;
}) {
  const {
    position,
    getEstimatedLocation,
    requestUserLocation,
    centerLatitude,
    centerLongitude,
    hasLocationPermission,
  } = useGeoLocation();
  const [distance, setDistance] = useState(TOURNAMENT_DISTANCE_IMPERIAL_OPTIONS[0]);
  const [competitionGender, setCompetitionGender] = useState({
    [CompetitionGenderEnum.Male]: false,
    [CompetitionGenderEnum.Female]: false,
    [CompetitionGenderEnum.Mixed]: false,
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isUsingSkillRange, setIsUsingSkillRange] = useState(false);
  const [isOpenDivision, setIsOpenDivision] = useState(false);
  const [isPrizeMoney, setIsPrizeMoney] = useState(false);
  const [costMinimum, setCostMinimum] = useState(MINIMUM_COST);
  const [costMaximum, setCostMaximum] = useState(MAXIMUM_COST);
  const [ageMinimum, setAgeMinimum] = useState(MINIMUM_AGE);
  const [ageMaximum, setAgeMaximum] = useState(MAXIMUM_AGE);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [skillLevelMinimum, setSkillLevelMinimum] = useState<number>(0);
  const [skillLevelMaximum, setSkillLevelMaximum] = useState<number>(6);
  const [teamType, setTeamType] = useState<TeamTypesEnum | string | null>(null);
  const [competitionFormat, setCompetitionFormat] = useState<EventGroupFormatsEnum | string | null>(
    null,
  );

  React.useEffect(() => {
    const getLocation = async () => {
      try {
        const canUseExactLocation = await hasLocationPermission();

        // if (!canUseExactLocation) {
        /**
         * @note exact was super slow, so turning on estimate for all cases until we can optimize
         */
        getEstimatedLocation()
          .then(() => {
            setIsPageLoaded(true);
          })
          .catch(() => {});
        // }

        requestUserLocation()
          .then(() => {
            setIsPageLoaded(true);
          })
          .catch(() => {
            setIsPageLoaded(true);
          })
          .catch(() => {});
      } catch (error) {
        getEstimatedLocation()
          .then(() => {
            setIsPageLoaded(true);
          })
          .catch(() => {});
      }
    };

    if (!position) {
      getLocation();
    } else {
      setIsPageLoaded(true);
    }
  }, [position]);

  const decoratedTournaments = React.useMemo(() => {
    let processedTournaments = (tournaments?.events || []).map((tournament) => {
      return {
        ...tournament,
        startTimestamp: new Date(tournament.startDateTime).getTime(),
        displayDate: formatDateRange(
          new Date(tournament.startDateTime),
          new Date(tournament.endDateTime),
        ),
        distance: Math.round(
          calculateHaversineDistance({
            coord1: {
              latitude: tournament.latitude,
              longitude: tournament.longitude,
            },
            coord2: {
              latitude: centerLatitude,
              longitude: centerLongitude,
            },
            unit: 'miles',
          }),
        ),
      };
    });

    return processedTournaments;
  }, [tournaments, centerLatitude, centerLongitude]);

  const tournamentsForMarketplace = React.useMemo(() => {
    const filterStart = Date.now();
    let processedTournaments = decoratedTournaments || [];

    if (distance?.id) {
      processedTournaments = processedTournaments.filter(
        (tournament) => tournament.distance <= distance.id,
      );
    }

    const isAnyCompetitionGenderActive = Object.values(competitionGender).some((value) => value);
    if (isAnyCompetitionGenderActive) {
      /**
       * @todo look for gender in the groups
       */
    }

    if (isPrizeMoney) {
      processedTournaments = processedTournaments.filter((tournament) => tournament.hasPrizes);
    }

    if (isUsingSkillRange) {
      /**
       * @todo look for skill level in the groups
       */
    }

    const isFilteringOnAge = ageMinimum !== MINIMUM_AGE || ageMaximum !== MAXIMUM_AGE;
    if (isFilteringOnAge) {
      /**
       * @todo look for age in the groups
       */
    }

    const isFilteringOnCost = costMinimum !== MINIMUM_COST || costMaximum !== MAXIMUM_COST;
    if (isFilteringOnCost) {
      processedTournaments = processedTournaments.filter((tournament) => {
        const cost = convertUnitPriceToFormattedPrice(tournament.registrationPriceUnitAmount || 0);
        return cost.priceFormatted >= costMinimum && cost.priceFormatted <= costMaximum;
      });
    }

    if (selectedDate && selectedDate > -1) {
      const today = startOfDay(new Date());
      const endOfRange = addDays(today, selectedDate);

      processedTournaments = processedTournaments.filter((tournament) => {
        return isBefore(addDays(new Date(tournament.startDateTime), 1), endOfRange);
      });
    }

    const finalTournaments = isPageLoaded
      ? processedTournaments.sort((a, b) => a.distance - b.distance)
      : processedTournaments
          .sort((a, b) => a.startTimestamp - b.startTimestamp)
          .slice(0, INITIAL_PAGE_SIZE);
    const filterEnd = Date.now();
    const filterDuration = filterEnd - filterStart;

    if (process.env.APP_STAGE !== 'production') {
      console.log('filterDuration', filterDuration);
    }

    return finalTournaments;
  }, [
    decoratedTournaments,
    distance,
    competitionGender,
    isPrizeMoney,
    isUsingSkillRange,
    skillLevelMinimum,
    skillLevelMaximum,
    ageMinimum,
    ageMaximum,
    selectedDate,
    costMinimum,
    costMaximum,
    isOpenDivision,
    isPageLoaded,
  ]);

  return (
    <>
      <Head
        title="Pickleball Tournaments"
        description="Find pickleball tournaments near you. Bounce is the pickleball app. Bounce lists all pickleball tournaments in the United States and North America."
      />
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <main className="h-full">
          <FilterBar
            distance={distance}
            setDistance={setDistance}
            competitionGender={competitionGender}
            setCompetitionGender={setCompetitionGender}
            isUsingSkillRange={isUsingSkillRange}
            setIsUsingSkillRange={setIsUsingSkillRange}
            isOpenDivision={isOpenDivision}
            setIsOpenDivision={setIsOpenDivision}
            skillLevelMinimum={skillLevelMinimum}
            setSkillLevelMinimum={setSkillLevelMinimum}
            skillLevelMaximum={skillLevelMaximum}
            setSkillLevelMaximum={setSkillLevelMaximum}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isPrizeMoney={isPrizeMoney}
            setIsPrizeMoney={setIsPrizeMoney}
            costMinimum={costMinimum}
            setCostMinimum={setCostMinimum}
            costMaximum={costMaximum}
            setCostMaximum={setCostMaximum}
            ageMinimum={ageMinimum}
            setAgeMinimum={setAgeMinimum}
            ageMaximum={ageMaximum}
            setAgeMaximum={setAgeMaximum}
            teamType={teamType}
            setTeamType={setTeamType}
            competitionFormat={competitionFormat}
            setCompetitionFormat={setCompetitionFormat}
          />
          <TournamentList tournaments={tournamentsForMarketplace} isPageLoaded={isPageLoaded} />
        </main>
      </SafeAreaPage>
      <Footer />
    </>
  );
}
