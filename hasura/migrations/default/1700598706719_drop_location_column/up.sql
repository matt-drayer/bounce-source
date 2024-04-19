-- For the 'countries' table
ALTER TABLE countries
DROP COLUMN IF EXISTS location;

-- For the 'country_subdivisions' table
ALTER TABLE country_subdivisions
DROP COLUMN IF EXISTS location;

-- For the 'cities' table
ALTER TABLE cities
DROP COLUMN IF EXISTS location;

-- For the 'venues' table
ALTER TABLE venues
DROP COLUMN IF EXISTS location;
