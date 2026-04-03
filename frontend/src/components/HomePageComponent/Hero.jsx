import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import axios from 'axios';

const Hero = () => {
  const permissionStatus = localStorage.getItem('notificationPermission') || 'unknown';
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const sendNotification = async () => {
    if (!token) {
        alert("Bhai, pehle Registration ID (Token) toh daal do!");
        return;
    }
    setLoading(true);
    try {
        const response = await axios.post('/api/v1/notifications/send', {
            registrationIds: [token],
            title: "Bhai Test Notification",
            body: "Aapne button click kiya aur notification aa gaya!"
        });
        console.log("Bhai, response aya:", response.data);
        alert("Bhai, Notification sent! Check kar lo.");
    } catch (error) {
        console.error("Bhai Error Detail:", error);
        console.error("Bhai Response Error:", error.response);
        alert("Bhai error aa gaya: " + (error.response?.data?.message || error.message));
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
        Push Notifications Bhai!
      </h2>
      <p className="text-text-muted max-w-2xl mb-8">
        This app uses Firebase to send notifications. We've requested permission on load. 
        Current status: <span className="text-white font-mono uppercase italic">{permissionStatus}</span>
      </p>
      
      <div className="card max-w-md w-full space-y-4">
        <div className="text-left">
            <label className="text-xs text-text-muted mb-1 block">Device Token (Registration ID)</label>
            <input 
                type="text" 
                placeholder="Paste token here bhai..."
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />
        </div>

        <p className="text-sm italic text-text-muted">
          Token daal ke niche click kar ke push karo!
        </p>
        
        <div className="grid grid-cols-2 gap-4">
            <button 
                className="glass hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all active:scale-95 text-sm"
                onClick={() => window.location.reload()}
            >
                Recheck Permission
            </button>
            <button 
                className="btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                onClick={sendNotification}
                disabled={loading}
            >
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Push Now</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
