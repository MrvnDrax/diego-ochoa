export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube';
export interface SocialLink { platform: SocialPlatform; label: string; handle: string; href: string; }
export const socialLinks: SocialLink[] = [];
