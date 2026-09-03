import React, {createContext, useEffect, useState} from 'react';
import type {User} from 'firebase/auth';
import {FIREBASE_AUTH} from '../Firebase/firebase-config';
import {onAuthStateChanged} from 'firebase/auth';

interface IAuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({children}: IAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; 
  }, []);
  const signOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <AuthContext.Provider value={{user, loading, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};
