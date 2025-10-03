import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, isAdmin, loading, is_pwd_update } = useAuth();

    if (loading) {
        return <Spin spinning={loading} />;
    }

    if (isAuthenticated) {
        if (location.pathname === '/login' || location.pathname === '/') {
            if (isAdmin) {
                return (<Navigate to={'/admin/home'} state={{ from: location }} replace />);
            } else {     
                if (is_pwd_update) {
                    return <Navigate to="/home" state={{ from: location }} replace />;
                } else {
                    return <Navigate to="/updatepassword" state={{ from: location }} replace />;
                }           
            }
        } else if (location.pathname === '/admin') {
            return (<Navigate to={'/admin/home'} state={{ from: location }} replace />);
        }
    } else if (!isAuthenticated && location.pathname !== '/login') {
        return (<Navigate to={'/login'} state={{ from: location }} replace />);
    }
    return children;
};