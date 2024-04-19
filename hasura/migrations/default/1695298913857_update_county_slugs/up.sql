UPDATE countries SET name_slug = slug;
UPDATE countries SET slug = LOWER(iso2);
