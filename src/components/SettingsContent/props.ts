import {
  UserCommunicationPreferences,
  useUpdateUserCommunicationPreferencesMutation,
} from 'types/generated/client';

export type CommunicationPreferences = Omit<
  UserCommunicationPreferences,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'user'
>;

export interface NotificationRowProps {
  label: string;
  itemKey: keyof CommunicationPreferences;
  userId: string;
  communicationPreferences: CommunicationPreferences;
  updatePreference: ReturnType<typeof useUpdateUserCommunicationPreferencesMutation>[0];
}
