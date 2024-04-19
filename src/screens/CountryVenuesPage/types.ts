export interface Props {
  countryName: string;
  hasSubdivisionImages?: boolean;
  subdivisions: {
    name: string;
    slug: string;
    courtCount: number;
  }[];
  jsonLd: string;
}
