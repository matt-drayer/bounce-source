-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION force_lowercase_invitation_email()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.invitation_email := LOWER(NEW.invitation_email);
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
