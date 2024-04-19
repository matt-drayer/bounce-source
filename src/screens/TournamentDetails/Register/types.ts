import * as z from 'zod';
import { ENABLE_BIRTHDAY_REQUIREMENT, RegisterProps, Steps } from '../types';

export { type RegisterProps, Steps, ENABLE_BIRTHDAY_REQUIREMENT };

export const tournamentRequirementsFormSchema = z.object({
  birthday: ENABLE_BIRTHDAY_REQUIREMENT ? z.string().min(1) : z.string().optional(),
  duprId: z.string().optional(),
});

export type TournamentRequirementsFormData = z.infer<typeof tournamentRequirementsFormSchema>;

export const groupSchema = z.object({
  groupId: z.string(),
  partnerEmail: z.union([z.string().email(), z.literal('')]).optional(),
  partnerName: z.string().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;

export const groupsFormSchema = z.object({
  groups: z.array(groupSchema),
});

export type GroupsFormData = z.infer<typeof groupsFormSchema>;

export const registrationFormSchema = z.object({
  duprId: z.string().optional(),
  birthday: z.string().optional(), // Validate as date in format yyyy-mm-dd
  groups: z.array(groupSchema),
});
export type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export type SetRegistrationFormData = React.Dispatch<React.SetStateAction<RegistrationFormData>>;

export interface PropsSetRegistrationFormData {
  setRegistrationFormData: SetRegistrationFormData;
}

export const REGISTER_API = '/v1/tournaments/register';
