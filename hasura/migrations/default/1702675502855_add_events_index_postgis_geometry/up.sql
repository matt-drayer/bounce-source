CREATE INDEX events_geometry_idx ON events USING GIST (geometry);
