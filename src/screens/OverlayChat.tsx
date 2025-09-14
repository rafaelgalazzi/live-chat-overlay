import { useEffect, useState } from 'react';
import { BaseChat, ChatMessage } from '../components/Chat/BaseChat';
import { BaseLayout } from '../components/Layout/BaseLayout';
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
    <BaseLayout>
      <BaseChat messages={messages}></BaseChat>
    </BaseLayout>
  );
}
