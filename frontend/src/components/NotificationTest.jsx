import React, { useState } from 'react';
import axios from 'axios';

const NotificationTest = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('fcmToken') || '');

  const sendTestNotification = async () => {
    if (!token) {
      setMessage('Token not found. Please refresh token first.');
      return;
    }

    setLoading(true);
    setMessage('Sending notification...');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/notifications/send`, {
        registrationIds: [token],
        title: 'Test Notification',
        body: 'Notification triggered successfully.'
      });

      if (response.data.success && response.data.data.success) {
        setMessage('Notification sent successfully bhai!');
      } else {
        const detail = response.data.data?.responses?.[0]?.error?.message || 'Failed to deliver notification.';
        setMessage(`Failed: ${detail}`);
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setMessage('Refreshing token...');
    try {
      const { clearAndRefreshToken } = await import('../services/fcmService');
      const newToken = await clearAndRefreshToken();
      if (newToken) {
        setToken(newToken);
        setMessage('Token refreshed successfully bhai!');
      } else {
        setMessage('Failed to refresh token.');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    const oldMessage = message;
    setMessage('Token copied to clipboard! 📋');
    setTimeout(() => setMessage(oldMessage), 2000);
  };

  return (
    <div className="p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-white mb-2">Notification Tester</h2>
      <p className="text-slate-400 mb-8 text-sm">
        Bhai, yeha se aap token dekh sakte ho aur notification test kar sakte ho.
      </p>
      
      {/* Token Display Area */}
      <div className="mb-8 p-4 bg-black/40 rounded-2xl border border-slate-800 relative group">
        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Device Registration Token</label>
        <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
                <p className="text-indigo-400 font-mono text-xs break-all line-clamp-2 italic">
                    {token || 'Token not found...'}
                </p>
            </div>
            {token && (
                <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    title="Copy Token"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={sendTestNotification}
          disabled={loading || !token}
          className={`py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
            loading || !token
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
          }`}
        >
          {loading ? 'Processing...' : 'Send Test Notification'}
        </button>

        <button
          onClick={refreshToken}
          disabled={loading}
          className={`py-4 px-6 rounded-2xl font-bold transition-all duration-300 border border-slate-700 text-slate-300 hover:bg-slate-800 active:scale-95 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Refresh Token
        </button>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-medium text-center animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.includes('Error') || message.includes('not found') || message.includes('Failed')
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default NotificationTest;
