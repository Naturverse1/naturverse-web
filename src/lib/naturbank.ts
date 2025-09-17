export type NaturTxType = 'grant' | 'spend';

export interface NaturTx {
  id: string;
  at: number;
  type: NaturTxType;
  amount: number;
  note?: string;
}

export interface NaturWallet {
  label: string;
  address: string;
  starting: number;
  txs: NaturTx[];
}

export function normalizeWalletId(raw: string): string {
  return raw.trim().replace(/\s+/g, '').toLowerCase();
}

const KEY = (uid: string) => `naturbank:${uid}`;
const storageKey = (uid: string) => KEY(normalizeWalletId(uid));

export function loadWallet(uid: string, starting = 120): NaturWallet {
  const key = storageKey(uid);
  const raw = localStorage.getItem(key);
  if (!raw) {
    const w: NaturWallet = { label: 'My Wallet', address: '', starting, txs: [] };
    localStorage.setItem(key, JSON.stringify(w));
    return w;
  }
  try {
    const parsed = JSON.parse(raw) as NaturWallet;
    const base: NaturWallet = { label: 'My Wallet', address: '', starting, txs: [] };
    return { ...base, ...parsed };
  } catch {
    const w: NaturWallet = { label: 'My Wallet', address: '', starting, txs: [] };
    localStorage.setItem(key, JSON.stringify(w));
    return w;
  }
}

export function saveWallet(uid: string, partial: Partial<NaturWallet>) {
  const key = storageKey(uid);
  const curr = loadWallet(uid);
  const next = { ...curr, ...partial };
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}

export function balanceOf(w: NaturWallet): number {
  const delta = w.txs.reduce((sum, t) => sum + (t.type === 'grant' ? t.amount : -t.amount), 0);
  return w.starting + delta;
}

export function addTx(uid: string, tx: Omit<NaturTx, 'id' | 'at'>) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const at = Date.now();
  const w = loadWallet(uid);
  const next: NaturWallet = { ...w, txs: [{ id, at, ...tx }, ...w.txs] };
  localStorage.setItem(storageKey(uid), JSON.stringify(next));
  return next;
}

type TransferInput = {
  fromUid: string;
  to: string;
  amount: number;
  note?: string;
  senderLabel?: string;
};

type TransferResult = {
  sender: NaturWallet;
  recipient: NaturWallet;
  recipientId: string;
  recipientLabel: string;
};

export function transferTo({ fromUid, to, amount, note, senderLabel }: TransferInput): TransferResult {
  const trimmedRecipient = to.trim();
  if (!trimmedRecipient) throw new Error('Enter a recipient');

  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter an amount greater than zero');

  const senderId = normalizeWalletId(fromUid);
  const recipientId = normalizeWalletId(trimmedRecipient);
  if (!recipientId) throw new Error('Enter a recipient');
  if (senderId === recipientId) throw new Error('You cannot send to yourself');

  const senderBefore = loadWallet(senderId);
  const senderBalance = balanceOf(senderBefore);
  if (senderBalance < amount) throw new Error('Insufficient balance');

  const senderNote = note?.trim() || undefined;
  const cleanedSenderLabel = senderLabel?.trim();
  const storedSenderLabel = senderBefore.label?.trim();
  const senderLabelForNote =
    (cleanedSenderLabel && cleanedSenderLabel !== 'My Wallet' && cleanedSenderLabel) ||
    (storedSenderLabel && storedSenderLabel !== 'My Wallet' && storedSenderLabel) ||
    fromUid.trim();

  const recipientBefore = loadWallet(recipientId);
  const recipientLabel = (() => {
    const existing = recipientBefore.label && recipientBefore.label !== 'My Wallet'
      ? recipientBefore.label
      : null;
    if (existing) return existing;
    if (recipientId.startsWith('@')) return recipientId;
    const cleaned = trimmedRecipient.replace(/\s+/g, ' ').trim();
    return cleaned || recipientId;
  })();

  const sender = addTx(senderId, { type: 'spend', amount, note: senderNote });
  let recipient = addTx(recipientId, {
    type: 'grant',
    amount,
    note: `From ${senderLabelForNote}`,
  });

  if (!recipientBefore.label || recipientBefore.label === 'My Wallet') {
    recipient = saveWallet(recipientId, { label: recipientLabel });
  }

  return { sender, recipient, recipientId, recipientLabel: recipient.label || recipientLabel };
}

export * from './naturbank/api';
