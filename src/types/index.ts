export interface InstagramProfile {
    id: string;
    username: string;
    account_type: string;
    media_count: number;
    profile_picture_url?: string;
    name?: string;
  }
  
  export interface InstagramMedia {
    id: string;
    media_type: string;
    media_url: string;
    caption?: string;
    timestamp: string;
  }
  