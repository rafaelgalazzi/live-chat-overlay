import { useCallback } from 'react';

declare global {
  interface Window {
    electron: {
      invoke: <T, R>(channel: string, data?: T) => Promise<R>;
      sendMessage: <T>(channel: string, data?: T) => void;
      on: (channel: string, callback: (...args: unknown[]) => void) => () => void;
      once: (channel: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export function useElectron() {
  /**
   * Comunicação request/response
   * @param channel Nome do canal IPC registrado no Electron (ipcMain.handle)
   * @param data Dados opcionais a serem enviados
   */
  const invoke = useCallback(async <T, R>(channel: string, data?: T): Promise<R | null> => {
    if (!window.electron || typeof window.electron.invoke !== 'function') {
      console.error('Electron API não disponível. Verifique o preload.js.');
      return null;
    }

    try {
      return await window.electron.invoke<T, R>(channel, data);
    } catch (err) {
      console.error(`Erro ao enviar para o Electron [${channel}]:`, err);
      return null;
    }
  }, []);

  /**
   * Comunicação unidirecional (fire and forget)
   * @param channel Nome do canal IPC registrado no Electron (ipcMain.on)
   * @param data Dados opcionais a serem enviados
   */
  const sendMessage = useCallback(<T>(channel: string, data?: T): void => {
    if (!window.electron || typeof window.electron.sendMessage !== 'function') {
      console.error('Electron API não disponível. Verifique o preload.js.');
      return;
    }

    window.electron.sendMessage<T>(channel, data);
  }, []);

  /**
   * Escuta eventos contínuos
   * @param channel Canal para escutar mensagens do backend
   * @param callback Função chamada quando o evento ocorrer
   * @returns Função para remover o listener
   */
  const on = useCallback(<T>(channel: string, callback: (data: T) => void) => {
    if (!window.electron || typeof window.electron.on !== 'function') {
      console.error('Electron API não disponível. Verifique o preload.js.');
      return () => {};
    }

    return window.electron.on(channel, (...args: unknown[]) => {
      const [data] = args;
      callback(data as T);
    });
  }, []);
  /**
   * Escuta apenas o primeiro evento e remove
   * @param channel Canal para escutar mensagens do backend
   * @param callback Função chamada quando o evento ocorrer
   */
  const once = useCallback((channel: string, callback: (...args: unknown[]) => void) => {
    if (!window.electron || typeof window.electron.once !== 'function') {
      console.error('Electron API não disponível. Verifique o preload.js.');
      return;
    }

    window.electron.once(channel, callback);
  }, []);

  return { invoke, sendMessage, on, once };
}
