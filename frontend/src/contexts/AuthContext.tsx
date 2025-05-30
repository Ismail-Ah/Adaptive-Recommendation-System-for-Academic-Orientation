import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { AuthState, AuthContextType, RegisterData, User } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  token: null,
};

const BACKEND_URL = "http://localhost:8081";
const BACKEND_URL_CHANGEMENT = "http://localhost:8086";

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_CHECKED' }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        isCheckingAuth: false,
        error: action.payload,
      };
    case 'AUTH_CHECKED':
      return { ...state, isCheckingAuth: false };
    case 'LOGOUT':
      return { ...initialState, token: null, isCheckingAuth: false };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Token invalid');
          return response.json();
        })
        .then((data: User) => {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: data, token } });
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid token' });
        });
    } else {
      dispatch({ type: 'AUTH_CHECKED' });
    }
  }, []);

  const login = useCallback(async (studentId: string, password: string, isAdmin: string): Promise<User> => {
    try {
      dispatch({ type: 'AUTH_START' });
      console.log('Attempting login with:', { email: studentId, password, role: isAdmin });
      
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentId, password, role: isAdmin }),
      });
      
      console.log('Login response status:', response.status);
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = JSON.parse(responseText);
      console.log('Parsed login data:', data);
  
      const user: User = {
        id: data.id,
        email: data.email,
        filiere: data.filiere,
        name: data.name,
        montionBac: data.montionBac,
        duree: data.duree,
        year: data.year,
        interests: data.interests || [],
        subjects: data.subjects || [],
        careerAspirations: data.careerAspirations || [],
        role: data.role,
      };
  
      localStorage.setItem('token', data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: data.token } });
  
      return user;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid credentials' });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      console.log("Attempting to register with data:", data);
      dispatch({ type: 'AUTH_START' });
      
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log("Registration response status:", response.status);
      const responseText = await response.text();
      console.log("Registration response text:", responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Registration failed');
      }

      const responseData = JSON.parse(responseText);
      console.log("Parsed registration data:", responseData);

      const user: User = {
        id: responseData.id,
        email: responseData.email,
        filiere: responseData.filiere,
        name: responseData.name,
        montionBac: responseData.montionBac,
        duree: responseData.duree,
        year: responseData.year,
        interests: responseData.interests || [],
        subjects: responseData.subjects || [],
        careerAspirations: responseData.careerAspirations || [],
        role: responseData.role,
      };

      localStorage.setItem('token', responseData.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: responseData.token } });
      console.log("Registration successful, user created:", user);
    } catch (error) {
      console.error('Registration error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const updateProfile = useCallback(async (data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedUser: User = await response.json();
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: updatedUser, token } });
      try {
        const response2 = await fetch('/api/v2/profile-updated', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', // Include if your backend requires cookies or credentials
        });
      
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
      
        console.log('detect changement called correctly');
      } catch (error) {
        console.error('Fetch error:', error);
      }
      

    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }, []);

  const isAdmin = useCallback(() => {
    console.log('isAdmin check - User role:', state.user?.role);
    return state.user?.role?.toUpperCase() === 'ADMIN';
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}