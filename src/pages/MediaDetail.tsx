import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Comment {
  id: string;
  username: string;
  text: string;
  replies: string[]; // just strings for simplicity
}

interface MediaDetail {
  id: string;
  media_url: string;
  caption: string;
  timestamp: string;
}

const MediaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<MediaDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with real API fetch
    const mockMedia: MediaDetail = {
      id: id || 'media1',
      media_url: 'https://picsum.photos/600/600?random=1',
      caption: 'API magic ✨',
      timestamp: '2023-12-01T10:00:00Z',
    };

    const mockComments: Comment[] = [
      {
        id: 'comment1',
        username: 'tech_guru',
        text: 'Awesome work!',
        replies: ['Thanks!'],
      },
      {
        id: 'comment2',
        username: 'frontend_fan',
        text: 'React + IG API is 🔥',
        replies: [],
      },
    ];

    setMedia(mockMedia);
    setComments(mockComments);
  }, [id]);

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, replyText] }
          : comment
      )
    );
    setReplyText('');
    setActiveCommentId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {media && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <img
            src={media.media_url}
            alt="Media"
            className="w-full h-96 object-cover rounded-md mb-4"
          />
          <h2 className="text-lg font-semibold">{media.caption}</h2>
          <p className="text-sm text-gray-500">{new Date(media.timestamp).toLocaleString()}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-md font-semibold mb-4">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <p>
              <span className="font-medium">{comment.username}</span>: {comment.text}
            </p>
            <div className="ml-4 mt-2 space-y-1">
              {comment.replies.map((reply, index) => (
                <p key={index} className="text-sm text-gray-600">
                  ↪️ {reply}
                </p>
              ))}
            </div>

            {activeCommentId === comment.id ? (
              <div className="mt-2 ml-4 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Write a reply..."
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Reply
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveCommentId(comment.id)}
                className="text-sm text-blue-500 mt-2 ml-4"
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaDetail;
