// types/instagram.ts
export interface InstagramUser {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  followers_count?: number;
  biography?: string;
  website?: string;
  profile_picture_url?: string;
}

  
  export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: string;
    media_url: string;
    permalink: string;
    timestamp: string;
  }
  
  export interface InstagramComment {
    id: string;
    text: string;
    username: string;
    timestamp: string;
  }