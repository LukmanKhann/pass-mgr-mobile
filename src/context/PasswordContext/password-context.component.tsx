import React, {createContext, useEffect, useState, useContext} from 'react';
import * as databaseModule from '@react-native-firebase/database';


interface IRtdbSnapshot {
  exists: () => boolean;
  val: () => Record<string, any>;
}

interface IRtdbRef {
  once: (event: string) => Promise<IRtdbSnapshot>;
  push: () => { key: string | null; set: (value: unknown) => Promise<void> };
  set: (value: unknown) => Promise<void>;
  update: (value: unknown) => Promise<void>;
  remove: () => Promise<void>;
  on: (event: string, cb: (snap: IRtdbSnapshot) => void) => void;
  off: (event: string, cb: (snap: IRtdbSnapshot) => void) => void;
}

const database = databaseModule.default as unknown as () => { ref: (path: string) => IRtdbRef };
import {AuthContext} from '../../Auth/AuthContext';
import CryptoJS from 'crypto-js';
import {
  getCurrentFormattedDate,
  handleFirebaseTimestamp,
} from '../../global/utils/date.util';

interface IPasswordItemShape {
  id: string;
  title: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

interface IPasswordContextValue {
  passwords: IPasswordItemShape[];
  addPassword: (title: string, username: string, password: string, category?: string) => Promise<void>;
  editPassword: (id: string, title: string, username: string, password: string, category?: string) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
  loadPasswords: () => Promise<void>;
  setupRealtimeListener: () => (() => void) | undefined;
}

const PasswordContext = createContext<IPasswordContextValue>({
  passwords: [],
  addPassword: async () => {},
  editPassword: async () => {},
  deletePassword: async () => {},
  loadPasswords: async () => {},
  setupRealtimeListener: () => undefined,
});

export const PasswordProvider = ({children}: {children: React.ReactNode}) => {
  const [passwords, setPasswords] = useState<IPasswordItemShape[]>([]);
  const {user} = useContext(AuthContext);

  const getEncryptionKey = () => {
    if (!user) return null;
    return CryptoJS.SHA256(
      user.uid + '6xDSGdNxFBP1ZMuuFdNQOFTrfVkmKF8i',
    ).toString();
  };

  const encryptData = (data: string): string => {
    const key = getEncryptionKey();
    if (!key) return data;
    return CryptoJS.AES.encrypt(data, key).toString();
  };

  const decryptData = (encryptedData: string): string => {
    const key = getEncryptionKey();
    if (!key) return encryptedData;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  };

  // Keep legacy method names for backward compatibility
  const encryptPassword = (password: string): string => encryptData(password);
  const decryptPassword = (encryptedPassword: string): string => decryptData(encryptedPassword);

  useEffect(() => {
    if (user) {
      loadPasswords();
    } else {
      setPasswords([]);
    }
  }, [user]);

  const loadPasswords = async (): Promise<void> => {
    if (!user) return;

    try {
      const passwordsRef = database().ref(`passwords/${user.uid}`);
      const snapshot = await passwordsRef.once('value');

      if (snapshot.exists()) {
        const passwordsData = snapshot.val();
        const passwordsArray = Object.keys(passwordsData).map((key: string) => {
          const passwordData = passwordsData[key];
          return {
            id: key,
            title: passwordData.title,
            username: decryptData(passwordData.username),
            password: decryptData(passwordData.password),
            createdAt: handleFirebaseTimestamp(passwordData.createdAt),
            updatedAt: handleFirebaseTimestamp(passwordData.updatedAt),
            category: passwordData.category || 'General',
          };
        });
        setPasswords(passwordsArray);
      } else {
        setPasswords([]);
      }
    } catch (error) {
      console.error('Error loading passwords from Realtime Database:', error);
    }
  };

  const addPassword = async (title: string, username: string, password: string, category?: string): Promise<void> => {
    if (!user) return;

    try {
      const passwordsRef = database().ref(`passwords/${user.uid}`);
      const newPasswordRef = passwordsRef.push();

      const newPassword = {
        title,
        username: encryptData(username),
        password: encryptData(password),
        createdAt: getCurrentFormattedDate(),
        updatedAt: getCurrentFormattedDate(),
        category: category || 'General',
      };

      await newPasswordRef.set(newPassword);

      setPasswords(prevPasswords => [
        ...prevPasswords,
        {
          id: newPasswordRef.key ?? '',
          title,
          username,
          password,
          createdAt: getCurrentFormattedDate(),
          updatedAt: getCurrentFormattedDate(),
          category: category || 'General',
        },
      ]);
    } catch (error) {
      console.error('Error adding password to Realtime Database:', error);
    }
  };

  const editPassword = async (id: string, title: string, username: string, password: string, category?: string): Promise<void> => {
    if (!user) return;

    try {
      const passwordRef = database().ref(`passwords/${user.uid}/${id}`);

      const updatedPassword = {
        title,
        username: encryptData(username),
        password: encryptData(password),
        updatedAt: getCurrentFormattedDate(),
        category: category || 'General',
      };

      await passwordRef.update(updatedPassword);

      setPasswords(prevPasswords =>
        prevPasswords.map(item =>
          item.id === id
            ? {
                ...item,
                title,
                username,
                password,
                updatedAt: getCurrentFormattedDate(),
                category: category || 'General',
              }
            : item,
        ),
      );
    } catch (error) {
      console.error('Error updating password in Realtime Database:', error);
    }
  };

  const deletePassword = async (id: string): Promise<void> => {
    if (!user) return;

    try {
      const passwordRef = database().ref(`passwords/${user.uid}/${id}`);
      await passwordRef.remove();

      setPasswords(prevPasswords =>
        prevPasswords.filter(item => item.id !== id),
      );
    } catch (error) {
      console.error('Error deleting password from Realtime Database:', error);
    }
  };

  const setupRealtimeListener = () => {
    if (!user) return;

    const passwordsRef = database().ref(`passwords/${user.uid}`);
    const onDataChange = (snapshot: IRtdbSnapshot) => {
      if (snapshot.exists()) {
        const passwordsData = snapshot.val();
        const passwordsArray = Object.keys(passwordsData).map((key: string) => {
          const passwordData = passwordsData[key];
          return {
            id: key,
            title: passwordData.title,
            username: decryptData(passwordData.username),
            password: decryptData(passwordData.password),
            createdAt: handleFirebaseTimestamp(passwordData.createdAt),
            updatedAt: handleFirebaseTimestamp(passwordData.updatedAt),
            category: passwordData.category || 'General',
          };
        });
        setPasswords(passwordsArray);
      } else {
        setPasswords([]);
      }
    };

    passwordsRef.on('value', onDataChange);

    return () => passwordsRef.off('value', onDataChange);
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        addPassword,
        editPassword,
        deletePassword,
        loadPasswords,
        setupRealtimeListener,
      }}>
      {children}
    </PasswordContext.Provider>
  );
};

export default PasswordContext;
