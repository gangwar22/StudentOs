import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, clearAuthToken, getAuthToken, saveAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(getAuthToken()));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    localStorage.removeItem('student_os_user');
    localStorage.removeItem('student_os_auth');

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    apiRequest('/api/auth/me')
      .then((response) => {
        if (cancelled) return;
        setUser(response.user);
        setIsAuthenticated(true);
        setAuthError('');
      })
      .catch((error) => {
        if (cancelled) return;
        const invalidSession = error.message.includes('session has expired') || error.message.includes('could not be found');
        if (invalidSession) {
          clearAuthToken();
          setToken(null);
        }
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(invalidSession ? '' : error.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [token]);

  const establishSession = (response, rememberMe = true) => {
    saveAuthToken(response.token, rememberMe);
    setUser(response.user);
    setIsAuthenticated(true);
    setAuthError('');
    setToken(response.token);
  };

  const login = async (email, password, rememberMe = false) => {
    if (!email || !password) throw new Error('Please enter both email and password.');
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email: email.toLowerCase().trim(), password })
    });
    establishSession(response, rememberMe);
    return { success: true, user: response.user };
  };

  const register = async (data) => {
    if (!data.name || !data.email || !data.password) {
      throw new Error('All fields are required.');
    }
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        name: data.name.trim(),
        targetRole: data.targetRole || 'Full Stack Developer'
      })
    });
    establishSession(response);
    return { success: true, user: response.user };
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError('');
  };

  const updateProfile = async (updatedFields) => {
    const { email: ignoredEmail, ...editableFields } = updatedFields;
    const profile = { ...user, ...editableFields, email: user?.email };
    await apiRequest('/api/user/sync', {
      method: 'POST',
      body: JSON.stringify({ profile })
    });
    setUser((previous) => ({ ...previous, ...editableFields, email: previous.email }));
  };

  const completeOnboarding = async (preferences) => {
    const updatedPreferences = { ...user?.preferences, ...preferences };
    await apiRequest('/api/user/sync', {
      method: 'POST',
      body: JSON.stringify({ profile: { preferences: updatedPreferences } })
    });
    setUser((previous) => ({ ...previous, onboarded: true, preferences: updatedPreferences }));
  };

  const requestAdminAccess = async (reason) => {
    const response = await apiRequest('/api/admin/requests', {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    setUser((previous) => ({
      ...previous,
      adminRequestStatus: response.request.status,
      adminRequestReason: response.request.reason,
      adminRequestedAt: response.request.requestedAt
    }));
    return response.request;
  };

  const sendVerificationCode = async () => apiRequest('/api/auth/email-verification/send', {
    method: 'POST',
    body: JSON.stringify({})
  });

  const verifyEmail = async (code) => {
    const response = await apiRequest('/api/auth/email-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    setUser(response.user);
    return response.user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      authError,
      login,
      register,
      logout,
      updateProfile,
      completeOnboarding,
      requestAdminAccess,
      sendVerificationCode,
      verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
