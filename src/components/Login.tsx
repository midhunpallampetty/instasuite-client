import React, { useEffect } from 'react';
import { Instagram, Camera, Video, MessageCircle, TrendingUp } from 'lucide-react';

const Login: React.FC = () => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const SCOPE = [
    "instagram_business_basic",
    "instagram_business_content_publish",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments"
  
  ].join(",");

  const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&response_type=code`;

  const features = [
    { icon: Camera, title: 'Content Publishing', description: 'Schedule and publish photos directly to your feed' },
    { icon: MessageCircle, title: 'Message Management', description: 'Handle DMs and comments efficiently' },
    { icon: TrendingUp, title: 'Analytics', description: 'Track engagement and growth metrics' },
    { icon: Video, title: 'Story Management', description: 'Create and schedule Instagram stories' }
  ];

  // Function to handle the Instagram login callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Capture the login time when user logs in successfully
      const loginTime = new Date().toISOString(); // or use Date.now() for a timestamp
      localStorage.setItem('loginTime', loginTime); // Store it in localStorage

      console.log('Login Time:', loginTime);
      // Redirect or handle the login process here as needed
      // Example: window.location.replace('/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Login Card */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 order-2 md:order-1 border border-gray-700 transform transition-all duration-500 hover:border-pink-500/30 animate-[fadeSlideUp_0.5s_ease-out] hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
              <div className="flex flex-col items-center text-center">
                <Instagram className="w-12 h-12 text-pink-500 mb-4 animate-[float_3s_ease-in-out_infinite]" />
                <h1 className="text-3xl font-bold text-white mb-2 animate-[fadeSlideUp_0.6s_ease-out]">Instagram Business Suite</h1>
                <p className="text-gray-400 mb-8 animate-[fadeSlideUp_0.7s_ease-out]">Connect your Instagram Business account to get started</p>

                <a href={INSTAGRAM_AUTH_URL} className="w-full animate-[fadeSlideUp_0.8s_ease-out]">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.02] animate-[pulse-glow_2s_ease-in-out_infinite]">
                    <Instagram className="w-5 h-5" />
                    Continue with Instagram
                  </button>
                </a>

                <p className="text-sm text-gray-400 mt-6 animate-[fadeSlideUp_0.9s_ease-out]">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">Privacy Policy</a>
                </p>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold text-white mb-6 animate-[fadeSlideUp_0.5s_ease-out]">Powerful Instagram Management Tools</h2>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg animate-[fadeSlideUp_0.5s_ease-out]"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="bg-gray-700 p-3 rounded-lg transition-transform duration-300 hover:scale-110">
                      <feature.icon className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
