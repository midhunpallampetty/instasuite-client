import React, { useEffect, useState } from 'react';
import { InstagramProfile, InstagramMedia } from '../types';
import MediaCard from '../components/MediaCard';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    const mockProfile: InstagramProfile = {
      id: '123456',
      username: 'dev_with_empathy',
      account_type: 'BUSINESS',
      media_count: 5,
      profile_picture_url: 'https://i.pravatar.cc/150?img=3',
      name: 'Empathy Dev'
    };

    const mockMedia: InstagramMedia[] = [
      {
        id: 'media1',
        media_type: 'IMAGE',
        media_url: 'https://picsum.photos/400/400?1',
        caption: 'Loving the API life 💻',
        timestamp: '2023-12-01T10:00:00Z',
      },
      {
        id: 'media2',
        media_type: 'IMAGE',
        media_url: 'https://picsum.photos/400/400?2',
        caption: 'Another day, another React page!',
        timestamp: '2023-12-02T15:30:00Z',
      },
    ];

    setProfile(mockProfile);
    setMedia(mockMedia);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {profile && (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.profile_picture_url}
            alt={profile.username}
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <h1 className="text-xl font-semibold">{profile.name}</h1>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="text-sm text-gray-500">Posts: {profile.media_count}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
