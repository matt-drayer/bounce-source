interface Params {
  count: number;
  countText?: string;
  singular: string;
  plural?: string;
  hideCount?: boolean;
}

export const pluralize = ({ count, countText, singular, plural, hideCount }: Params) => {
  if (count === 1) {
    return hideCount ? singular : `${countText || count} ${singular}`;
  }

  return hideCount
    ? `${plural || `${singular}s`}`.trim()
    : `${countText || count} ${plural || `${singular}s`}`.trim();
};
