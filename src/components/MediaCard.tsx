import React from 'react';
import { InstagramMedia } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  media: InstagramMedia;
}

const MediaCard: React.FC<Props> = ({ media }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/media/${media.id}`)}
    >
      <img
        src={media.media_url}
        alt={media.caption}
        className="w-full h-60 object-cover"
      />
      <div className="p-3">
        <p className="text-sm text-gray-700">{media.caption || 'No caption'}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(media.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;
