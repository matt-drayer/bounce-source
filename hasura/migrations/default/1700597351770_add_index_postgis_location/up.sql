CREATE INDEX countries_location_idx ON countries USING GIST (location);
CREATE INDEX country_subdivisions_location_idx ON country_subdivisions USING GIST (location);
CREATE INDEX cities_location_idx ON cities USING GIST (location);
CREATE INDEX venues_location_idx ON venues USING GIST (location);
