import React from 'react';

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/instagram';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
      >
        Login with Instagram
      </button>
    </div>
  );
};

export default Login;
