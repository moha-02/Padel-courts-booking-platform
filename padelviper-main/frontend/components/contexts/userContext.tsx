import React, { createContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from "crypto-js"
interface User {
  user: {
    acces: string;
    created_at: string;
    email: string;
    email_verified_at: string;
    id: string;
    name: string;
    nivel: string;
    surname: string;
    tel: string;
    updated_at: string;
  };
  token: string;
}

interface UserContextType {
  dataUser: User | null;
  updateUser: (userData: User | null) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType>({
  dataUser: null,
  updateUser: () => {},
  setUser: () => {},
});

const secretKey = 'mySecretKey'; // Esta clave debe ser secreta y segura

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recuperar los datos del usuario del almacenamiento local al cargar la aplicación
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(storedUserData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData);
      } catch (error) {
        console.error('Error al desencriptar los datos del usuario:', error);
      }
    }
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userData), secretKey).toString();
      sessionStorage.setItem('userData', encryptedData);
    } else {
      sessionStorage.removeItem('userData');
    }
  };

  return (
    <UserContext.Provider value={{ dataUser, updateUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
