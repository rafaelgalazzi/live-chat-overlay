import { ReactNode, useEffect, useRef, useState } from 'react';
import { BaseChat } from '../components/Chat/BaseChat';
import { useElectron } from '../hooks/useElectron';
import { TwitchMessage, useTwitchMessage } from '../hooks/useTwitchMessage';
import { TiktokMessage, useTiktokMessage } from '../hooks/useTiktokMessage';

interface ChatMessage {
  twitchMessage?: TwitchMessage;
  tiktokMessage?: TiktokMessage;
}

export function OverlayChat() {
  const [messages, setMessages] = useState<ReactNode[]>([]);
  const { on } = useElectron();
  const { formatTwitchMessage } = useTwitchMessage();
  const { formatTiktokMessage } = useTiktokMessage();
  const MAX_MESSAGES = 1000;

  const bufferRef = useRef<ReactNode[]>([]);

  useEffect(() => {
    const chatMessagesListener = on('update-chat', (data: ChatMessage) => {
      if (data.twitchMessage) {
        bufferRef.current.push(formatTwitchMessage(data.twitchMessage, bufferRef.current.length));
      } else if (data.tiktokMessage) {
        bufferRef.current.push(formatTiktokMessage(data.tiktokMessage, bufferRef.current.length));
      } else {
        return;
      }

      if (bufferRef.current.length > MAX_MESSAGES) {
        bufferRef.current.splice(0, bufferRef.current.length - MAX_MESSAGES);
      }

      setMessages([...bufferRef.current]);
    });

    return () => chatMessagesListener();
  }, [on, formatTwitchMessage, formatTiktokMessage]);

  return (
    <div className="flex h-full">
      <BaseChat messages={messages}></BaseChat>
    </div>
  );
}
