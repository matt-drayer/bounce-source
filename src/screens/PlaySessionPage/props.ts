export interface ServerProps {
  injectedPlaySessionId: string | null;
}

export interface Props extends ServerProps {
  isNewPlaySession: boolean;
  isModal?: boolean;
  closeModal?: () => void;
  fetchPlaySessions?: () => void;
}
