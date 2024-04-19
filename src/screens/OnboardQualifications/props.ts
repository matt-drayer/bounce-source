import { GetAvailableCoachQualificationsQuery } from 'types/generated/server';

export interface StaticProps {
  coachQualifications: GetAvailableCoachQualificationsQuery['coachQualifications'];
}

export interface Props extends StaticProps {
  isCoach: boolean;
}
