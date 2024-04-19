-- Subquery to find duplicates
WITH duplicated AS (
    SELECT 
        cs.id, 
        LOWER(REGEXP_REPLACE(REGEXP_REPLACE(UNACCENT(cs.name), '\s+', '-', 'g'), '[^\w-]+', '', 'g')) 
        || '-' || LOWER(c.slug) as generated_slug,
        ROW_NUMBER() OVER (PARTITION BY LOWER(REGEXP_REPLACE(REGEXP_REPLACE(UNACCENT(cs.name), '\s+', '-', 'g'), '[^\w-]+', '', 'g')) || '-' || LOWER(c.slug)) as rn
    FROM 
        country_subdivisions cs
    JOIN 
        countries c ON cs.country_id = c.id
)
-- Update statement to modify duplicates by appending the id
UPDATE country_subdivisions cs
SET slug = ds.generated_slug || '-' || cs.id
FROM duplicated ds
WHERE cs.id = ds.id AND ds.rn > 1; -- This condition ensures that only duplicates are updated;
