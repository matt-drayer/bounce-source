import { User } from 'firebase/auth';
import { AuthStatus, HasuraClaims } from 'constants/auth';

export const DEFAULT_LOCALE = 'en-US';

export const EMPTY_AVATAR_SRC = '/images/app/empty-avatar.png';

// TODO: Have a config param as well to load user settings from the DB
export interface Viewer {
  status: AuthStatus;
  viewer: User | null;
  config: null;
  claims: HasuraClaims | null;
  userId: string | null | undefined;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Anonymous = 'anonymous',
}

export enum Theme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export enum AccountType {
  Coach = 'COACH',
  Player = 'PLAYER',
}

// NOTE: This is one they can't upate themselves
export enum CoachMarketplaceStatus {
  None = 'NONE',
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Rejected = 'REJECTED',
  Inactive = 'INACTIVE',
  Blocked = 'BLOCKED',
}

// 2022-08-12 username Regex
// - Between 4 and 28 characters (1 alphanumeric at the front, 1 in the back, and 2-26 of allows characters in the middle)
// - Underscores are the only special character
// - Underscores can't repeat
// - Underscores can't be at the beginning or end
// - We'll let them use capitals in the input, but going to the database, it will be transformed to lowercase
export const USERNAME_REGEX = /^[a-z0-9]([_](?![_])|[a-z0-9]){2,26}[a-z0-9]$/;
export const USERNAME_REGEX_CASE_INSENSITIVE = /^[a-z0-9]([_](?![_])|[a-z0-9]){2,26}[a-z0-9]$/i;

export const getIsValidUsernameFormat = (username: string) => USERNAME_REGEX.test(username);
export const getIsValidUsernameCaseIncensitiveFormat = (username: string) =>
  USERNAME_REGEX_CASE_INSENSITIVE.test(username);

// 2022-08-12 password Regex
// At least 8 characters, 1 lower, 1 upper, and 1 number. Any other characters allowed.
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const MINIMUM_PASSWORD_LENGTH = 8;
export const getIsValidPasswordFormat = (password: string) =>
  password.length >= MINIMUM_PASSWORD_LENGTH;

export const SKILL_NO_RESPONSE_RANK = -1;
