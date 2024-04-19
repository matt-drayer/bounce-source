export interface Props {
  countryName: string;
  countryId: string;
  countrySlug: string;
  regionName: string;
  regionSlug: string;
  cities: {
    name: string;
    slug: string;
    courtCount: number;
  }[];
  venues: {
    id: string;
    title: string;
    slug: string;
    addressString: string;
    indoorCourtCount: number;
    outdoorCourtCount: number;
    cityName: string;
  }[];
  jsonLd: string;
}
