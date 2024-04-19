export interface Props {
  title: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  courtName: string;
  participants?: {
    id: string;
    name: string;
    image: string;
  }[];
  participantCount?: number | null;
  participantLimit?: number | null;
  organizerName: string;
  isParticipant: boolean;
  skillRatingMinimum?: number | null;
  skillRatingMaximum?: number | null;
  commentCount: number;
  date: string;
  isShowDate?: boolean;
}
