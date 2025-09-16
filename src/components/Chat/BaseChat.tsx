import React, { ReactNode, useEffect, useRef } from 'react';

interface BaseChatProps {
  messages: ReactNode[];
}

export function BaseChat({ messages }: BaseChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatRef} style={styles.wrap} className="hide-scrollbar">
      {messages.map((msg) => msg)}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    background: '#0e0e10',
    color: '#efeff1',
    padding: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
    width: 500,
    height: 500,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
};
