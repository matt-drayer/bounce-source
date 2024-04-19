import { EventGroupFormatsEnum } from 'types/generated/client';

const groupFormatToName = {
  [EventGroupFormatsEnum.RoundRobin]: 'Round Robin',
  [EventGroupFormatsEnum.SingleElimination]: 'Single Elimination',
  [EventGroupFormatsEnum.RoundRobinSingleElimination]: 'Round Robin + Single Elimination',
  [EventGroupFormatsEnum.Custom]: 'Custom',
};

export function getGroupFormatName(groupFormat: EventGroupFormatsEnum) {
  return groupFormatToName[groupFormat];
}
