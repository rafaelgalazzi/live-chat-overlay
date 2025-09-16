import { useCallback, useState } from 'react';
import { useElectron } from './useElectron';

export function useAuth() {
  const { invoke } = useElectron();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyAuth = useCallback(async () => {
    const response = await invoke<undefined, boolean>('verifyAuthentication');
    setIsAuthenticated(!!response);
  }, [invoke]);

  return { verifyAuth, isAuthenticated };
}
