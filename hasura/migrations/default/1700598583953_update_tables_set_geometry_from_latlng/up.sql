UPDATE countries SET geometry = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE country_subdivisions SET geometry = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE cities SET geometry = ST_SetSRID(ST_Point(longitude, latitude), 4326);
UPDATE venues SET geometry = ST_SetSRID(ST_Point(longitude, latitude), 4326);
