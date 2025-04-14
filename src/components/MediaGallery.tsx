import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Image, Video, Calendar, ExternalLink, Loader2, AlertCircle, RefreshCcw, X, MessageCircle } from 'lucide-react';
interface MediaGalleryProps {
  onClose: () => void; // Add this line
}
interface InstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
}

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  comments?: InstagramComment[];
}

interface MediaResponse {
  data: InstagramMedia[];
  paging: {
    cursors?: {
      after: string;
    };
    next?: string;
  };
}

interface ModalProps {
  item: InstagramMedia | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[80vw] max-h-[80vh] bg-gray-900 rounded-xl overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          <div className="lg:flex-1 relative bg-black flex items-center justify-center">
            {item.media_type === 'VIDEO' ? (
              <video
                src={item.media_url}
                controls
                poster={item.thumbnail_url}
                className="max-h-[60vh] lg:max-h-[80vh] w-full object-contain"
                autoPlay
              />
            ) : (
              <img
                src={item.media_url}
                alt={item.caption || 'Instagram post'}
                className="max-h-[60vh] lg:max-h-[80vh] w-full object-contain"
              />
            )}
          </div>

          <div className="lg:w-96 p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {item.caption && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Caption</span>
                  </div>
                  <p className="text-gray-200 bg-gray-800/50 rounded-lg p-3">
                    {item.caption}
                  </p>
                </div>
              )}

              {item.comments && item.comments.length > 0 && (
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Comments</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                      {item.comments.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {item.comments.map(comment => (
                      <div 
                        key={comment.id}
                        className="group relative text-sm bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-100">
                            {comment.username}
                          </span>
                          <time className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <time>
                  {new Date(item.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold transition-all duration-300 hover:opacity-90"
              >
                <ExternalLink className="w-4 h-4" />
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaGallery: React.FC<MediaGalleryProps> = ()=> {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [paging, setPaging] = useState<MediaResponse['paging']>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InstagramMedia | null>(null);

  const loadMedia = async (cursor?: string) => {
    try {
      const token = Cookies.get('insta_token');
      if (!token) throw new Error('No authentication token found');

      const isInitialLoad = !cursor;
      if (isInitialLoad) setLoading(true);

      const response = await axios.get<MediaResponse>('https://www.eduvia.space/api/instagram-media', {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          after: cursor, 
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,comments.limit(10){id,text,username,timestamp}' 
        },
      });

      setMedia(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newUniqueItems = response.data.data.filter(item => !existingIds.has(item.id));
        return [...prev, ...newUniqueItems];
      });

      setPaging(response.data.paging);
      setError(null);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error || 'Failed to load media'
          : 'An unexpected error occurred'
      );
    } finally {
      if (!cursor) setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadMedia();
    }
  }, []);

  const handleLoadMore = () => {
    if (paging.cursors?.after && !isLoadingMore) {
      setIsLoadingMore(true);
      loadMedia(paging.cursors.after);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
          <p className="text-lg animate-pulse">Loading your Instagram media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="bg-gray-800/50 rounded-xl p-8 max-w-md w-full border border-red-500/30 animate-[fadeSlideUp_0.5s_ease-out]">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Error Loading Media</span>
          </div>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => loadMedia()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-200"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!media.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="bg-gray-800/50 rounded-xl p-8 max-w-md w-full border border-gray-700 text-center animate-[fadeSlideUp_0.5s_ease-out]">
          <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
          <p className="text-gray-400">Start sharing on Instagram to see your content here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 animate-[fadeSlideUp_0.5s_ease-out]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media
            .filter(item => item.media_url)
            .map((item, index) => (
              <MediaItem 
                key={item.id} 
                item={item} 
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedItem(item)}
              />
            ))}
        </div>

        {paging.next && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                {isLoadingMore ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Image className="w-5 h-5" />
                )}
                {isLoadingMore ? 'Loading more posts...' : 'Load More Posts'}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        )}
      </div>

      <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
};

const MediaItem: React.FC<{ 
  item: InstagramMedia;
  style?: React.CSSProperties;
  onClick: () => void;
}> = React.memo(({ item, style, onClick }) => {
  return (
    <div
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] animate-[fadeSlideUp_0.5s_ease-out] cursor-pointer"
      style={style}
      onClick={onClick}
    >
      <div className="relative group">
        {item.media_type === 'VIDEO' ? (
          <div className="aspect-square">
            <video
              src={item.media_url}
              poster={item.thumbnail_url}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full">
              <Video className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="aspect-square">
            <img
              src={item.media_url || item.thumbnail_url}
              alt={item.caption || 'Instagram post'}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <div className="flex items-center justify-center text-white">
              <span className="text-sm">View Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {item.caption && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-2">
            {truncateCaption(item.caption, 100)}
          </p>
        )}
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
          {item.comments && item.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{item.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const truncateCaption = (text: string, maxLength: number) => {
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

export default MediaGallery;