export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Profile {
  id?: string;
  userId?: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  cvUrl?: string;
  location?: string;
  contactEmail?: string;
  socialLinks: SocialLinks;
  createdAt?: string;
  updatedAt?: string;
}