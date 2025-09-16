import { useCallback } from 'react';
import { WebcastChatMessage, WebcastGiftMessage } from 'tiktok-live-connector';

export type TiktokMessage = WebcastChatMessage | WebcastGiftMessage;

const styles: Record<string, React.CSSProperties> = {
  line: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1.35,
    wordBreak: 'break-word',
    flexShrink: 0,
    gap: 4,
  },
  avatar: { width: 20, height: 20, borderRadius: '50%' },
  nick: {
    fontWeight: 700,
    marginRight: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 150,
    display: 'inline-block',
    verticalAlign: 'top',
  },
  colon: { opacity: 0.8, marginRight: 4 },
  msg: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    flex: 1,
    gap: 2,
  },
  gift: {
    color: '#FF4500',
    fontWeight: 600,
  },
};

export function useTiktokMessage() {
  const formatTiktokMessage = useCallback((msg: TiktokMessage, index: number) => {
    const username = msg.user?.nickname || msg.user?.uniqueId || 'user';
    const avatar = msg.user?.profilePicture?.url?.[0] || '';

    return (
      <div key={`tiktok:${index}`} style={styles.line}>
        {avatar && <img src={avatar} alt="avatar" style={styles.avatar} />}
        <span style={styles.nick}>{username}</span>
        <span style={styles.colon}>:</span>

        {'comment' in msg && <span style={styles.msg}>{msg.comment}</span>}

        {'giftId' in msg && (
          <span style={{ ...styles.msg, ...styles.gift }}>
            🎁 Enviou {msg.giftDetails?.giftName || 'um presente'} × {msg.repeatCount || 1}
          </span>
        )}
      </div>
    );
  }, []);

  return {
    formatTiktokMessage,
  };
}
