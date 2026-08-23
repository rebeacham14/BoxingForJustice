import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function loadStoredUser() {
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');

  if (!savedUser || !savedToken) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error('Invalid saved user data:', error);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  function login(userData, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
