import { getAvailableCoachQualifications } from 'services/server/graphql/queries/getAvailableCoachQualifications';
import OnboardQualifications from 'screens/OnboardQualifications';
import { StaticProps } from 'screens/OnboardQualifications/props';

export const getStaticProps = async () => {
  const data = await getAvailableCoachQualifications();

  const props: StaticProps = {
    coachQualifications: data.coachQualifications,
  };

  return {
    props,
  };
};

const CoachOnboardQualifications: React.FC<StaticProps> = ({ coachQualifications }) => {
  return <OnboardQualifications isCoach coachQualifications={coachQualifications} />;
};

export default CoachOnboardQualifications;
