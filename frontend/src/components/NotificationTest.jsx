import React, { useState } from 'react';
import axios from 'axios';

const NotificationTest = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendTestNotification = async () => {
    const token = localStorage.getItem('fcmToken');
    if (!token) {
      setMessage('Bhai, token nahi mila! Console check karo.');
      return;
    }

    setLoading(true);
    setMessage('Bhai, bhej rha hoon...');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/notifications/send`, {
        registrationIds: [token],
        title: 'Bhai ka Test!',
        body: 'Abe dikh raha hai kya notification?'
      });

      if (response.data.success) {
        setMessage('Bhai, notification chala gaya! Check karo.');
      } else {
        setMessage('Bhai, kuch gadbad hui error check karo.');
      }
    } catch (error) {
      console.error('Bhai Error sending test:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-white mb-4">Notification Tester Bhai</h2>
      <p className="text-slate-400 mb-6 text-sm">
        Bhai is button ko click karte hi tere self device par notification aayega agar token sahi hai toh.
      </p>
      
      <button
        onClick={sendTestNotification}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
          loading 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
        }`}
      >
        {loading ? 'Bhai bhej rha hai...' : 'Send Test Notification'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
          message.includes('Error') || message.includes('nahi mila')
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
