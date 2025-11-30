import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { bumpStreak, getStreak } from '../utils/streak';
import { grantReward } from '../utils/rewards';
import ConfettiBurst from './ConfettiBurst';
import StreakPill from './StreakPill';

type StoredQuest = {
  id: string;
  title: string;
  rewardNatur: number;
  world?: string;
  stampLabel?: string;
  acceptedAt?: string;
};

type NaturverseQuestEvent =
  | { type: 'questAccepted'; quest: StoredQuest }
  | { type: 'questCompleted'; quest: StoredQuest };

const ACTIVE_QUEST_STORAGE_KEY = 'natur:questActive:v1';
const NATURVERSE_EVENT = 'naturverse';

const cardStyle: CSSProperties = {
  maxWidth: 780,
  margin: '16px auto 0',
  borderRadius: 18,
  border: '1px solid #E6EBF5',
  background: '#fff',
  padding: 16,
  boxShadow: '0 6px 18px rgba(18, 40, 120, 0.06)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 8,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#111827',
};

const questTitleStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#0f172a',
};

const metaStyle: CSSProperties = {
  fontSize: '0.9rem',
  color: '#475569',
  marginTop: 4,
};

const emptyStyle: CSSProperties = {
  fontSize: '0.92rem',
  color: '#475569',
};

const parseStoredQuest = (raw: unknown): StoredQuest | null => {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as {
    id?: unknown;
    title?: unknown;
    rewardNatur?: unknown;
    world?: unknown;
    stampLabel?: unknown;
    acceptedAt?: unknown;
  };
  const id = typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id.trim() : null;
  const title = typeof candidate.title === 'string' && candidate.title.trim() ? candidate.title.trim() : null;
  const reward = Number.isFinite(candidate.rewardNatur)
    ? Math.max(0, Math.round(Number(candidate.rewardNatur)))
    : null;
  if (!id || !title || reward === null || reward <= 0) return null;
  const quest: StoredQuest = { id, title, rewardNatur: reward };
  if (typeof candidate.world === 'string' && candidate.world.trim()) {
    quest.world = candidate.world.trim();
  }
  if (typeof candidate.stampLabel === 'string' && candidate.stampLabel.trim()) {
    quest.stampLabel = candidate.stampLabel.trim();
  }
  if (typeof candidate.acceptedAt === 'string' && candidate.acceptedAt) {
    const parsedDate = new Date(candidate.acceptedAt);
    if (!Number.isNaN(parsedDate.getTime())) {
      quest.acceptedAt = parsedDate.toISOString();
    }
  }
  return quest;
};

const loadActiveQuest = (): StoredQuest | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_QUEST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parseStoredQuest(parsed);
  } catch {
    return null;
  }
};

const storeActiveQuest = (quest: StoredQuest | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (quest) {
      window.localStorage.setItem(ACTIVE_QUEST_STORAGE_KEY, JSON.stringify(quest));
    } else {
      window.localStorage.removeItem(ACTIVE_QUEST_STORAGE_KEY);
    }
  } catch {}
};

const formatAcceptedAt = (acceptedAt?: string) => {
  if (!acceptedAt) return '';
  const date = new Date(acceptedAt);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
};

export default function MyQuestsCard() {
  const [hydrated, setHydrated] = useState(false);
  const [activeQuest, setActiveQuest] = useState<StoredQuest | null>(null);
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setActiveQuest(loadActiveQuest());
    setStreak(getStreak().count);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNaturverse = (event: Event) => {
      const custom = event as CustomEvent<NaturverseQuestEvent>;
      const detail = custom.detail;
      if (!detail || !detail.quest) return;
      if (detail.type === 'questAccepted') {
        setActiveQuest(detail.quest);
        storeActiveQuest(detail.quest);
        return;
      }
      if (detail.type === 'questCompleted') {
        storeActiveQuest(null);
        grantReward(detail.quest.rewardNatur, `Quest: ${detail.quest.title}`);
        const nextCount = bumpStreak();
        setStreak(nextCount);
        setActiveQuest(prev => (prev && prev.id === detail.quest.id ? null : prev));
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
        setConfetti(true);
        timerRef.current = window.setTimeout(() => {
          setConfetti(false);
          timerRef.current = null;
        }, 1600);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_QUEST_STORAGE_KEY) {
        setActiveQuest(loadActiveQuest());
      }
    };

    window.addEventListener(NATURVERSE_EVENT, handleNaturverse as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(NATURVERSE_EVENT, handleNaturverse as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  if (!hydrated) return null;
  if (!activeQuest && streak === 0) return null;

  const acceptedLabel = activeQuest?.acceptedAt ? `Accepted ${formatAcceptedAt(activeQuest.acceptedAt)}` : 'Status: Accepted';

  return (
    <div style={cardStyle} aria-live="polite">
      <div style={headerStyle}>
        <h3 style={titleStyle}>My Quests</h3>
        <StreakPill count={streak} />
      </div>
      {activeQuest ? (
        <div>
          <div style={questTitleStyle}>{activeQuest.title}</div>
          <div style={metaStyle}>{acceptedLabel}</div>
          <div style={metaStyle}>Reward: +{activeQuest.rewardNatur} NATUR</div>
        </div>
      ) : (
        <div style={emptyStyle}>No active quests right now. Come back for more!</div>
      )}
      <ConfettiBurst trigger={confetti} />
    </div>
  );
}
