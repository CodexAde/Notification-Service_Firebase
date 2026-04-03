import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../Layout/MainLayout';
import HomePage from '../Pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
