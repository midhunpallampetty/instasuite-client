import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InstagramUser } from '../types/instagram';
import Cookies from 'js-cookie';
import { Instagram, Users, Image, Link, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import MediaGallery from './MediaGallery';
import Swal from 'sweetalert2';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<InstagramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const checkSessionTimeout = () => {
      const loginTime = Cookies.get('login_time');
      const currentTime = new Date().getTime();

      if (loginTime) {
        const elapsedTime = currentTime - Number(loginTime);

        if (elapsedTime >= 1000) {
          Cookies.remove('insta_token');
          Cookies.remove('login_time');

          Swal.fire({
            icon: 'warning',
            title: 'Session Timeout',
            text: 'Your session has expired. Please log in again.',
            confirmButtonText: 'OK',
            willClose: () => {
              window.location.href = '/login';
            }
          });
        }
      }
    };

    checkSessionTimeout();

    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('insta_token');
        if (!token) {
          setError('No access token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://www.eduvia.space/api/instagram-profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handlePostClick = () => {
    setShowGallery(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex items-center gap-3 text-pink-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30">
          <div className="flex items-center gap-3 text-red-500 mb-3">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Error</span>
          </div>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="bg-transparent rounded-xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
          <div className="flex items-center gap-3 text-yellow-500 mb-3">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">No Data</span>
          </div>
          <p className="text-gray-400">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 animate-[fadeSlideUp_0.5s_ease-out]">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500/30 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={profile.profile_picture_url || `https://ui-avatars.com/api/?name=${profile.username}&background=random&bold=true&size=128`}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 animate-pulse" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">@{profile.username}</h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                <div className="bg-gray-700/50 rounded-lg px-4 py-2">
                  <span className="text-gray-400 text-sm">Account Type</span>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    {profile.account_type}
                  </div>
                </div>
                <div 
                  onClick={handlePostClick}
                  className="bg-gray-700/50 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-600 transition"
                >
                  <span className="text-gray-400 text-sm">Posts</span>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <Image className="w-4 h-4 text-pink-500" />
                    {profile.media_count}
                  </div>
                </div>
                {profile.followers_count && (
                  <div className="bg-gray-700/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Followers</span>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-500" />
                      {profile.followers_count.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              
              {profile.biography && (
                <p className="text-gray-300 mb-4 max-w-2xl">
                  {profile.biography}
                </p>
              )}
              
              {profile.website && (
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Link className="w-4 h-4" />
                  {new URL(profile.website).hostname}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              Account Details
            </h2>
            <div className="grid gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Profile ID:</span>
                <span className="text-white font-mono bg-gray-700 px-2 py-1 rounded">{profile.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-mono bg-gray-700 px-2 py-1 rounded">@{profile.username}</span>
              </div>
            </div>
          </div>

          {/* View Posts Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handlePostClick}
              className="inline-flex items-center gap-2 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              <Image className="w-4 h-4" />
              View Posts
            </button>
          </div>
        </div>
      </div>

      {/* MediaGallery Modal */}
      {showGallery && <MediaGallery onClose={() => setShowGallery(false)} />}
    </div>
  );
};

export default Profile;
