import { mapValues } from 'lodash';

export const convertToNextObj = <T>(obj: Record<string, any>) =>
  mapValues(obj, (value) => {
    return value !== undefined ? value : null;
  }) as T;
