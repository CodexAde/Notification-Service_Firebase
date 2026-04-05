import React from 'react';
import Hero from '../components/HomePageComponent/Hero';
import NotificationTest from '../components/NotificationTest';

const HomePage = () => {
  return (
    <div className="space-y-12 pb-20">
      <Hero />
      <NotificationTest />
    </div>
  );
};

export default HomePage;
