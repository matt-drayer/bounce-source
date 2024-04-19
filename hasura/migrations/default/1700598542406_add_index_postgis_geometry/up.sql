CREATE INDEX countries_geometry_idx ON countries USING GIST (geometry);
CREATE INDEX country_subdivisions_geometry_idx ON country_subdivisions USING GIST (geometry);
CREATE INDEX cities_geometry_idx ON cities USING GIST (geometry);
CREATE INDEX venues_geometry_idx ON venues USING GIST (geometry);
