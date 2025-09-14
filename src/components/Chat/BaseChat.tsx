import React, { useEffect, useRef, useState } from 'react';
import type { ChatUserstate } from 'tmi.js';

export interface ChatMessage {
  message: string;
  tags: ChatUserstate;
}

type BadgeMap = Record<string, string>;

interface BaseChatProps {
  messages: ChatMessage[];
  broadcasterId?: string;
}

export function BaseChat({ messages, broadcasterId }: BaseChatProps) {
  const [badgeMap, setBadgeMap] = useState<BadgeMap>({});
  const chatRef = useRef<HTMLDivElement>(null);

  // injeta o CSS para esconder scrollbar
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

  // carrega catálogo uma vez
  useEffect(() => {
    (async () => {
      const map = await window.electron.invoke<{ broadcasterId?: string }, BadgeMap>('get-badges-map', {
        broadcasterId,
      });
      if (map) setBadgeMap(map);
    })();
  }, [broadcasterId]);

  // scroll automático quando novas mensagens chegam
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatRef} style={styles.wrap} className="hide-scrollbar">
      {messages.map((msg, i) => {
        const username = msg.tags['display-name'] || msg.tags['username'] || 'user';
        const nameColor = msg.tags.color || colorFromUsername(username);

        const badgeImgs = getBadgeImagesFromTags(msg.tags, badgeMap);

        return (
          <div key={`chat:${i}`} style={styles.line}>
            {badgeImgs.length > 0 && (
              <span style={styles.badges}>
                {badgeImgs.map((src, idx) => (src ? <img key={idx} src={src} alt="" style={styles.badgeImg} /> : null))}
              </span>
            )}
            <span style={{ ...styles.nick, color: nameColor }}>{username}</span>
            <span style={styles.colon}>:</span>
            <span style={styles.msg}>{msg.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function getBadgeImagesFromTags(tags: ChatUserstate, badgeMap: Record<string, string>) {
  const out: string[] = [];
  const badges = tags.badges || {};
  for (const [set, version] of Object.entries(badges)) {
    const key = `${set}/${version}`;
    const img = badgeMap[key];
    if (img) out.push(img);
  }
  return out;
}

function colorFromUsername(name: string) {
  const colors = [
    '#FF4500',
    '#2E8B57',
    '#1E90FF',
    '#DAA520',
    '#D2691E',
    '#5F9EA0',
    '#FF69B4',
    '#9ACD32',
    '#FF7F50',
    '#00FF7F',
    '#8A2BE2',
    '#20B2AA',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
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
    overflowY: 'auto', // mantém o scroll
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1.35,
    wordBreak: 'break-word',
    flexShrink: 0,
  },
  badges: { display: 'inline-flex', gap: 2, marginRight: 4 },
  badgeImg: { width: 16, height: 16 },
  nick: {
    fontWeight: 700,
    marginRight: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 150,
    display: 'inline-block',
  },
  colon: { opacity: 0.8, marginRight: 4 },
  msg: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    flex: 1,
  },
};
