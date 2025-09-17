import { useEffect, useMemo, useRef, useState } from 'react';
import './turian.css';

type Role = 'user' | 'bot' | 'notice';
type QuestStatus = 'offered' | 'accepted';

type QuestOffer = {
  id: string;
  title: string;
  rewardNatur: number;
  world: string;
  stampLabel: string;
};

type ChatMessageEntry = {
  id: string;
  kind: 'message';
  role: Role;
  text: string;
  createdAt: number;
};

type ChatQuestEntry = {
  id: string;
  kind: 'quest';
  quest: QuestOffer;
  status: QuestStatus;
  createdAt: number;
  acceptedAt?: number;
  receipt?: string;
};

type ChatEntry = ChatMessageEntry | ChatQuestEntry;

type OfflineQuest = QuestOffer & { instructions: string };

const STORAGE_KEY = 'naturverse.turian.thread.v1';
const QUEST_TAG = /<<quest\|([^|]+)\|([^|]+)\|([^|]+)\|([^|>]+)(?:\|([^|>]+))?>>/i;
const QUEST_REWARD = 5;
const MAX_ENTRIES = 80;

const INITIAL_ENTRIES: ChatEntry[] = [
  {
    id: 'welcome',
    kind: 'message',
    role: 'bot',
    text: "Heya! I'm Turian the Durian, your cheerful Naturverse guide. Ask for quests, tips, or fun facts and I'll keep it light!",
    createdAt: Date.now(),
  },
];

const OFFLINE_QUESTS: OfflineQuest[] = [
  {
    id: 'plant-a-seed',
    title: 'Plant a seed IRL 🌱',
    rewardNatur: QUEST_REWARD,
    world: 'Flora',
    stampLabel: 'Flora',
    instructions: 'Find a seed or bean and tuck it into soil today. Give it a tiny sip of water to help it sprout.',
  },
  {
    id: 'sky-sketch',
    title: 'Sketch today\'s sky ☁️',
    rewardNatur: QUEST_REWARD,
    world: 'Skylands',
    stampLabel: 'Skylands',
    instructions: 'Step outside for a minute and doodle what the sky looks like right now—colors, clouds, or stars!',
  },
  {
    id: 'nature-sounds',
    title: 'Collect a nature sound 🎶',
    rewardNatur: QUEST_REWARD,
    world: 'Fauna',
    stampLabel: 'Fauna',
    instructions: 'Listen closely outdoors and imitate or record one sound from a bird, bug, or breeze.',
  },
  {
    id: 'water-guardian',
    title: 'Water a friendly plant 💧',
    rewardNatur: QUEST_REWARD,
    world: 'Aqua',
    stampLabel: 'Aqua',
    instructions: 'Choose a plant (indoor or outdoor) and give it a caring splash of water to brighten its day.',
  },
];

const KEYWORD_HINTS: { regex: RegExp; questId: string }[] = [
  { regex: /(seed|plant|garden)/i, questId: 'plant-a-seed' },
  { regex: /(sky|cloud|star)/i, questId: 'sky-sketch' },
  { regex: /(sound|bird|listen)/i, questId: 'nature-sounds' },
  { regex: /(water|thirsty|plant)/i, questId: 'water-guardian' },
];

const wantsQuest = (text: string) => /(quest|mission|challenge|task)/i.test(text);

const createId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

const sanitizeMessageEntry = (item: any): ChatMessageEntry | null => {
  if (!item || typeof item !== 'object') return null;
  if (item.kind !== 'message') return null;
  const role: Role = item.role === 'user' || item.role === 'bot' || item.role === 'notice' ? item.role : 'bot';
  const text = typeof item.text === 'string' ? item.text : '';
  if (!text) return null;
  const createdAt = typeof item.createdAt === 'number' ? item.createdAt : Date.now();
  const id = typeof item.id === 'string' ? item.id : createId('msg');
  return { id, kind: 'message', role, text, createdAt };
};

const sanitizeQuestEntry = (item: any): ChatQuestEntry | null => {
  if (!item || typeof item !== 'object') return null;
  if (item.kind !== 'quest' || !item.quest || typeof item.quest !== 'object') return null;
  const questRaw = item.quest;
  const quest: QuestOffer = {
    id: typeof questRaw.id === 'string' ? questRaw.id : createId('quest'),
    title: typeof questRaw.title === 'string' ? questRaw.title : 'Mini quest',
    rewardNatur: Number.isFinite(questRaw.rewardNatur) && questRaw.rewardNatur > 0 ? questRaw.rewardNatur : QUEST_REWARD,
    world: typeof questRaw.world === 'string' && questRaw.world.trim() ? questRaw.world : 'Flora',
    stampLabel: typeof questRaw.stampLabel === 'string' && questRaw.stampLabel.trim()
      ? questRaw.stampLabel
      : (typeof questRaw.world === 'string' ? questRaw.world : 'Flora'),
  };
  const id = typeof item.id === 'string' ? item.id : createId('quest');
  const createdAt = typeof item.createdAt === 'number' ? item.createdAt : Date.now();
  const status: QuestStatus = item.status === 'accepted' ? 'accepted' : 'offered';
  const acceptedAt = typeof item.acceptedAt === 'number' ? item.acceptedAt : undefined;
  const receipt = typeof item.receipt === 'string' ? item.receipt : undefined;
  return { id, kind: 'quest', quest, status, createdAt, acceptedAt, receipt };
};

const loadStoredEntries = (): ChatEntry[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const entries: ChatEntry[] = [];
    for (const item of parsed) {
      const msg = sanitizeMessageEntry(item);
      if (msg) { entries.push(msg); continue; }
      const quest = sanitizeQuestEntry(item);
      if (quest) { entries.push(quest); }
    }
    return entries.length ? entries : null;
  } catch {
    return null;
  }
};

const persistEntries = (entries: ChatEntry[]) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
};

const parseQuestTag = (text: string) => {
  const match = text.match(QUEST_TAG);
  if (!match) {
    return { cleaned: text.trim(), quest: null as QuestOffer | null };
  }
  const [, id, title, natur, world, label] = match;
  const reward = Number(natur);
  const quest: QuestOffer = {
    id: (id || '').trim() || createId('quest'),
    title: (title || '').trim() || 'Mini quest',
    rewardNatur: Number.isFinite(reward) && reward > 0 ? reward : QUEST_REWARD,
    world: (world || '').trim() || 'Flora',
    stampLabel: (label || world || '').trim() || 'Flora',
  };
  const cleaned = text.replace(match[0], '').replace(/\s{2,}/g, ' ').trim();
  return { cleaned, quest };
};

const pickOfflineQuest = (prompt: string): OfflineQuest => {
  const match = KEYWORD_HINTS.find(({ regex }) => regex.test(prompt));
  if (match) {
    const found = OFFLINE_QUESTS.find(q => q.id === match.questId);
    if (found) return found;
  }
  return OFFLINE_QUESTS[Math.floor(Math.random() * OFFLINE_QUESTS.length)];
};

const composeLocalQuestReply = (prompt: string, offline: boolean) => {
  const quest = pickOfflineQuest(prompt);
  const intro = offline
    ? "The connection's snoozing, but I still have a nature mission for you!"
    : "I've got a mini quest you can try right away!";
  const text = `${intro} ${quest.instructions} <<quest|${quest.id}|${quest.title}|${quest.rewardNatur}|${quest.world}|${quest.stampLabel}>>`;
  return { text, quest };
};

const limitEntries = (entries: ChatEntry[]) => {
  if (entries.length <= MAX_ENTRIES) return entries;
  return entries.slice(entries.length - MAX_ENTRIES);
};

export function TurianChat() {
  const [entries, setEntries] = useState<ChatEntry[]>(() => INITIAL_ENTRIES);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState<boolean>(true);
  const [busy, setBusy] = useState(false);
  const [processingQuestId, setProcessingQuestId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const offlineNotice = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = loadStoredEntries();
    if (stored && stored.length) {
      setEntries(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistEntries(entries);
  }, [entries, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  // simple heartbeat to decide ONLINE/OFFLINE badge
  useEffect(() => {
    const ping = async () => {
      try {
        const r = await fetch('/.netlify/functions/turian-chat-ping');
        setOnline(r.ok);
      } catch {
        setOnline(false);
      }
    };
    ping();
  }, []);

  useEffect(() => {
    view.current?.scrollTo({ top: view.current.scrollHeight, behavior: 'smooth' });
  }, [entries, busy, processingQuestId]);

  const appendEntries = (next: ChatEntry[]) => {
    if (!next.length) return;
    setEntries(prev => limitEntries([...prev, ...next]));
  };

  const addMessage = (role: Role, text: string) => {
    if (!text.trim()) return;
    const entry: ChatMessageEntry = {
      id: createId('msg'),
      kind: 'message',
      role,
      text: text.trim(),
      createdAt: Date.now(),
    };
    appendEntries([entry]);
  };

  const addQuestEntry = (quest: QuestOffer) => {
    const entry: ChatQuestEntry = {
      id: createId('quest'),
      kind: 'quest',
      quest,
      status: 'offered',
      createdAt: Date.now(),
    };
    appendEntries([entry]);
  };

  const handleReply = (reply: string, prompt: string) => {
    const { cleaned, quest } = parseQuestTag(reply);
    if (cleaned) addMessage('bot', cleaned);
    if (quest) {
      addQuestEntry({ ...quest, title: quest.title || 'Mini quest' });
      return;
    }
    if (wantsQuest(prompt)) {
      const local = composeLocalQuestReply(prompt, false);
      const parsed = parseQuestTag(local.text);
      if (parsed.cleaned) addMessage('bot', parsed.cleaned);
      if (parsed.quest) addQuestEntry(parsed.quest);
    }
  };

  const handleOffline = (prompt: string) => {
    setOnline(false);
    if (!offlineNotice.current) {
      addMessage('notice', "Offline mode engaged, yet I'm still bursting with jungle cheer. I'll keep sharing tips and quests locally until the breeze returns.");
      offlineNotice.current = true;
    }
    const local = composeLocalQuestReply(prompt, true);
    const parsed = parseQuestTag(local.text);
    if (parsed.cleaned) addMessage('bot', parsed.cleaned);
    if (parsed.quest) addQuestEntry(parsed.quest);
  };

  const buildPrompt = (prompt: string) => {
    const base = prompt.trim();
    const guidance = wantsQuest(prompt)
      ? 'If the explorer asks for a quest, give them one playful real-world action. After your short reply, add the tag <<quest|id|Title emoji|5|World|World>> exactly once so we can render the quest UI.'
      : 'If you share a quest, append the tag <<quest|id|Title emoji|5|World|World>> at the end so the UI can render it.';
    return `${base}\n\n${guidance}`;
  };

  const ask = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage('user', trimmed);
    setInput('');
    setBusy(true);

    try {
      const r = await fetch('/.netlify/functions/turian-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(trimmed) }),
      });
      if (!r.ok) throw new Error('offline');
      const { reply } = await r.json();
      setOnline(true);
      offlineNotice.current = false;
      handleReply(String(reply ?? ''), trimmed);
    } catch {
      handleOffline(trimmed);
    } finally {
      setBusy(false);
    }
  };

  const acceptQuest = (entry: ChatQuestEntry) => {
    if (entry.status === 'accepted') return;
    setProcessingQuestId(entry.id);
    try {
      if (typeof window !== 'undefined') {
        const detail = {
          id: entry.quest.id,
          title: entry.quest.title,
          world: entry.quest.world,
          rewardNatur: entry.quest.rewardNatur,
          stamp: entry.quest.stampLabel,
        } satisfies Record<string, unknown>;
        window.dispatchEvent(new CustomEvent('natur:quest:accepted', { detail }));
      }
      const receipt = `Quest saved — mark it complete below to earn +${entry.quest.rewardNatur} NATUR and a ${entry.quest.stampLabel} stamp.`;
      const acceptedAt = Date.now();
      setEntries(prev => prev.map(item => {
        if (item.kind === 'quest' && item.id === entry.id) {
          return { ...item, status: 'accepted', acceptedAt, receipt };
        }
        return item;
      }));
      setToast('Quest pinned to My Quests!');
    } catch (err) {
      console.error('turian-chat:acceptQuest failed', err);
      setToast('Whoops! I could not save that quest. Try again in a moment.');
    } finally {
      setProcessingQuestId(null);
    }
  };

  const markLater = (entry: ChatQuestEntry) => {
    setToast('Quest saved for later! Accept when you are ready.');
    setEntries(prev => prev.map(item => {
      if (item.kind === 'quest' && item.id === entry.id) {
        return { ...item, status: 'offered' };
      }
      return item;
    }));
  };

  const canSend = useMemo(() => input.trim().length > 0 && !busy, [input, busy]);

  return (
    <div className="turian-chat_card" aria-live="polite">
      <div className="turian-status" role="status">
        <span className={`turian-dot ${online ? 'turian-dot--online' : 'turian-dot--offline'}`} />
        <span>{online ? 'Online' : 'Offline mode'}</span>
      </div>

      <div ref={view} className="turian-thread" style={{ maxHeight: 420, overflowY: 'auto', padding: 4 }}>
        {entries.map(entry => {
          if (entry.kind === 'message') {
            return (
              <div key={entry.id} className={`turian-msg turian-msg--${entry.role}`}>
                {entry.text}
              </div>
            );
          }
          const accepted = entry.status === 'accepted';
          const accepting = processingQuestId === entry.id;
          return (
            <div key={entry.id} className={`turian-quest ${accepted ? 'turian-quest--accepted' : ''}`}>
              <div className="turian-quest__title">{entry.quest.title}</div>
              <div className="turian-quest__reward">Reward: +{entry.quest.rewardNatur} NATUR &amp; 1 Passport stamp ({entry.quest.stampLabel})</div>
              {accepted ? (
                <div className="turian-quest__footer">
                  <span className="turian-quest__status">Accepted ✓</span>
                  {entry.receipt && <div className="turian-quest__receipt">{entry.receipt}</div>}
                  <div className="turian-quest__links">
                    <a href="/naturbank" className="turian-quest__link">View in NaturBank</a>
                    <a href="/passport" className="turian-quest__link">View Passport</a>
                  </div>
                </div>
              ) : (
                <div className="turian-quest__actions">
                  <button
                    type="button"
                    className="turian-quest__btn turian-quest__btn--accept"
                    onClick={() => acceptQuest(entry)}
                    disabled={accepting}
                  >
                    {accepting ? 'Accepting…' : 'Accept'}
                  </button>
                  <button
                    type="button"
                    className="turian-quest__btn turian-quest__btn--later"
                    onClick={() => markLater(entry)}
                    disabled={accepting}
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="turian-composer">
        <input
          className="turian-input"
          placeholder="Ask Turian something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && canSend) {
              e.preventDefault();
              ask();
            }
          }}
          inputMode="text"
          aria-label="Message Turian"
        />
        <button className="turian-send" disabled={!canSend} onClick={ask}>
          {busy ? '…' : 'Send'}
        </button>
      </div>

      {toast && (
        <div className="turian-toast" role="status" aria-live="assertive">{toast}</div>
      )}
    </div>
  );
}

export default TurianChat;
