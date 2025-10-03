import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [is_pwd_update, setIsPwdUpdate] = useState(null); 
    const { token, error, isAdmin, is_pwd_update: pwdUpdateFromApi  } = useSelector(state => state.auth);
    
    useEffect(() => {
        if (error) {
            setIsAuthenticated(false);
            setIsPwdUpdate(null);
        }
        setLoading(false);
    }, [error]);

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            if (typeof pwdUpdateFromApi === "boolean") {
                setIsPwdUpdate(pwdUpdateFromApi);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [token])

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, isAdmin, is_pwd_update, setIsPwdUpdate }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
