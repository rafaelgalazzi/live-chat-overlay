import { useEffect, useRef, useState } from 'react';
import { BaseChat, TwitchMessage } from '../components/Chat/BaseChat';
import { useElectron } from '../hooks/useElectron';

export function OverlayChat() {
  const [messages, setMessages] = useState<TwitchMessage[]>([]);
  const { on } = useElectron();
  const MAX_MESSAGES = 1000;

  const bufferRef = useRef<TwitchMessage[]>([]);

  useEffect(() => {
    const chatMessagesListener = on('update-chat', (data: TwitchMessage) => {
      bufferRef.current.push(data);

      if (bufferRef.current.length > MAX_MESSAGES) {
        bufferRef.current.splice(0, bufferRef.current.length - MAX_MESSAGES);
      }

      setMessages([...bufferRef.current]);
    });

    return () => chatMessagesListener();
  }, [on]);

  return (
    <div className="flex h-full">
      <BaseChat messages={messages}></BaseChat>
    </div>
  );
}
