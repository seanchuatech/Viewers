import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('dental_token', data.token);
        // Preserve search parameters (like StudyInstanceUIDs)
        const search = window.location.search;
        navigate({
          pathname: '/dental',
          search: search,
        });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to backend server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090c29]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1a1d3d] rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-teal-500/20 rounded-full">
            <svg
              className="w-10 h-10 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dental Mode</h2>
          <p className="mt-2 text-white/60">Please sign in to access the viewer</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center text-xs text-white/40">
          Demo: admin / dental123
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
