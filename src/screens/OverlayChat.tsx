import { useEffect, useState } from 'react';
import { BaseChat, ChatMessage } from '../components/Chat/BaseChat';
import { useElectron } from '../hooks/useElectron';

export function OverlayChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { on } = useElectron();
  const MAX_MESSAGES = 1000;

  useEffect(() => {
    const chatMessagesListener = on('update-chat', (data: ChatMessage) => {
      setMessages(prev => {
        const updated = [...prev, data];
        if (updated.length > MAX_MESSAGES) {
          return updated.slice(updated.length - MAX_MESSAGES);
        }
        return updated;
      });
    });

    return () => chatMessagesListener();
  }, [on]);

  return (
    <div className='flex h-full'>
      <BaseChat messages={messages}></BaseChat>
    </div>
  );
}
