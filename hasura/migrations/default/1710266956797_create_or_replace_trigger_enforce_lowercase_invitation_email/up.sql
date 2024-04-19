CREATE TRIGGER enforce_lowercase_invitation_email
BEFORE INSERT OR UPDATE ON event_invitations
FOR EACH ROW EXECUTE FUNCTION force_lowercase_invitation_email();
