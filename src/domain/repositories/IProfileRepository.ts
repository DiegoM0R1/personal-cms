import { Profile } from '../models/Profile';

export interface IProfileRepository {
  getProfile(): Promise<Profile | null>;
  upsertProfile(profile: Profile): Promise<Profile>;
}