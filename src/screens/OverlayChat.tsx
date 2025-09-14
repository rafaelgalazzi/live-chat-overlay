import { useEffect, useState } from 'react';
import { BaseChat, ChatMessage } from '../components/Chat/BaseChat';
import { useElectron } from '../hooks/useElectron';

export function OverlayChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { on } = useElectron();

  useEffect(() => {
    const chatMessagesListener = on('update-chat', (data: ChatMessage) => {
      setMessages([...messages, data]);
    });

    return () => chatMessagesListener();
  }, [on, messages]);

  return (
    <div className='flex h-full'>
      <BaseChat messages={messages}></BaseChat>
    </div>
  );
}
