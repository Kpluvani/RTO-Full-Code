import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Spin } from "antd";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthProvider } from "./AuthProvider";
import { routesList, adminRouteList, userRouteList } from './routesList';
import { PageNotFound } from './PageNotFound';

export const AppRoutes = () => {
  const { token, error, isAdmin } = useSelector(state => state.auth);

  return (
    <AuthProvider>
      <Routes>
        {routesList.map((route, i) => (
          <Route
            key={i}
            path={route.path}
            loader={<Spin spinning={true} />}
            element={(
              <ProtectedRoute>
                {route.component}
              </ProtectedRoute>
            )}
          />
        ))}
        {(token ? (isAdmin ? adminRouteList : userRouteList) : []).map((route, i) => (
          <Route
            key={i}
            path={route.path}
            loader={<Spin spinning={true} />}
            element={(
              <ProtectedRoute>
                {route.component}
              </ProtectedRoute>
            )}
          />
        ))}
        
        <Route path="*" element={<Navigate to={token ? "/404" : "/login"} replace />} />
        <Route path="/404" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
};