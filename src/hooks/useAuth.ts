import { useState } from 'react';
import { useElectron } from './useElectron';

export function useAuth() {
  const { invoke } = useElectron();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  async function verifyAuth() {
    const response = await invoke<undefined, boolean>('verifyAuthentication');
    setIsAuthenticated(!!response);
  }

  return { verifyAuth, isAuthenticated };
}
