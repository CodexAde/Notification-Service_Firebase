import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import axios from 'axios';

const Hero = () => {
  const permissionStatus = localStorage.getItem('notificationPermission') || 'unknown';
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const sendNotification = async () => {
    if (!token) {
        alert("Please provide a Registration ID (Token).");
        return;
    }
    setLoading(true);
    try {
        const response = await axios.post('/api/v1/notifications/send', {
            registrationIds: [token],
            title: "Test Notification",
            body: "Notification triggered successfully."
        });
        console.log("Response:", response.data);
        alert("Notification sent successfully.");
    } catch (error) {
        console.error("Error sending notification:", error);
        alert("Failed to send notification: " + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 p-4 bg-indigo-500/20 rounded-full animate-pulse">
        <Bell className="w-12 h-12 text-indigo-400" />
      </div>
      <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Push Notifications
      </h2>
      <p className="text-text-muted max-w-2xl mb-8">
        This application uses Firebase for push notifications.
        Current permission status: <span className="text-white font-mono uppercase italic">{permissionStatus}</span>
      </p>
      
      <div className="card max-w-md w-full space-y-4">
        <div className="text-left">
            <label className="text-xs text-text-muted mb-1 block">Device Token (Registration ID)</label>
            <input 
                type="text" 
                placeholder="Paste token here..."
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
        </div>

        <p className="text-sm italic text-text-muted">
          Enter token and click below to send.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
            <button 
                className="glass hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all active:scale-95 text-sm"
                onClick={() => window.location.reload()}
            >
                Refresh
            </button>
            <button 
                className="btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                onClick={sendNotification}
                disabled={loading}
            >
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Now</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
