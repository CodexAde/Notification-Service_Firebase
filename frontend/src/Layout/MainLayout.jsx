import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 glass sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Notification App</h1>
          <div className="flex gap-4">
            <span className="text-sm text-text-muted">Status: Active</span>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>
      <footer className="p-4 text-center text-text-muted text-sm glass">
        Built by Antigravity
      </footer>
    </div>
  );
};

export default MainLayout;
