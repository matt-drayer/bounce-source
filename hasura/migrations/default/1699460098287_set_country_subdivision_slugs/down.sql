-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- UPDATE
--     country_subdivisions cs
-- SET
--     slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(UNACCENT(cs.name), '\s+', '-', 'g'), '[^\w-]+', '', 'g')) || '-' || (SELECT LOWER(slug) FROM countries WHERE id = cs.country_id);
