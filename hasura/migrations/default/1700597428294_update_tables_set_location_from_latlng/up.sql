UPDATE countries SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE country_subdivisions SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE cities SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE venues SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326);
