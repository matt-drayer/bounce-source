import { getDisplayDateTimeForTimezone } from '../getDisplayDateTimeForTimezone';

describe('getDisplayDateTimeForTimezone', () => {
  // NOTE: WILL THIS BE FLAKY WITH DAYLIGHTS SAVINGS TIME?
  const isoDateString = '2021-08-07T12:00:00.000Z';

  it('handles a US date', () => {
    const timezoneName = 'America/Los_Angeles';
    const locale = 'en-US';
    const result = getDisplayDateTimeForTimezone({ isoDateString, timezoneName, locale });
    expect(result).toEqual('Saturday, 8/7/2021, 5:00 AM PDT');
  });
  it('handles a UK date', () => {
    const timezoneName = 'Europe/London';
    const locale = 'en-GB';
    const result = getDisplayDateTimeForTimezone({ isoDateString, timezoneName, locale });
    expect(result).toEqual('Saturday, 07/08/2021, 13:00 BST');
  });
  it('handles an Australian date', () => {
    const timezoneName = 'Australia/Sydney';
    const locale = 'en-AU';
    const result = getDisplayDateTimeForTimezone({ isoDateString, timezoneName, locale });
    expect(result).toEqual('Saturday, 07/08/2021, 10:00 pm AEST');
  });
  it('handles a South African date', () => {
    const timezoneName = 'Africa/Johannesburg';
    const locale = 'en-ZA';
    const result = getDisplayDateTimeForTimezone({ isoDateString, timezoneName, locale });
    expect(result).toEqual('Saturday, 2021/08/07, 14:00 SAST');
  });
});
