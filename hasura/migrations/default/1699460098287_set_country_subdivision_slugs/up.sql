UPDATE 
    country_subdivisions cs
SET 
    slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(UNACCENT(cs.name), '\s+', '-', 'g'), '[^\w-]+', '', 'g')) || '-' || (SELECT LOWER(slug) FROM countries WHERE id = cs.country_id);
