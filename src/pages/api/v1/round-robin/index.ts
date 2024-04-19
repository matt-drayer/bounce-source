import { NextApiResponse } from 'next';
import { HttpMethods } from 'constants/http';
import { responseJson200Success } from 'utils/server/serverless/http';
import { withHttpMethods } from 'utils/server/serverless/middleware/withHttpMethods';
import { NextApiRequestWithViewerRequired } from 'utils/server/serverless/middleware/withViewerDataRequired';
import { RunnerConfig, generateSchedule } from 'utils/shared/roundRobin/runner';

const POST = async (req: NextApiRequestWithViewerRequired, res: NextApiResponse) => {
  const { groupsCount, teamGroups, ...schedule } = req.body as RunnerConfig & {
    groupsCount: number;
    teamGroups: string[][];
  } & Omit<RunnerConfig, 'teams'>;

  const roundRobinResult = teamGroups.map((group) => {
    return generateSchedule({
      ...schedule,
      numCourts: Math.ceil(schedule.numCourts / groupsCount),
      numTeams: group.length,
      teams: group,
    });
  });

  return responseJson200Success(res, roundRobinResult);
};

export default withHttpMethods({
  [HttpMethods.Post]: POST,
});
