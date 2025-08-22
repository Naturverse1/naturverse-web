import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import '../../styles/zone-widgets.css';
import { BoardPost, Poll } from '../../lib/community/types';
import {
  hasVoted,
  loadBoard,
  loadPolls,
  rsvp,
  saveBoard,
  savePolls,
  submitVote,
  uid,
} from '../../lib/community/store';

export default function Community() {
  const [tab, setTab] = useState<'polls' | 'board' | 'coming'>('polls');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [board, setBoard] = useState<BoardPost[]>([]);

  useEffect(() => {
    const p = loadPolls();
    if (p.length === 0) {
      const seed: Poll[] = [
        {
          id: uid(),
          title: 'Vote for the next land to unlock',
          notes: 'Choose one of the proposed regions for 2025 content.',
          createdAt: new Date().toISOString(),
          choices: [
            { id: uid(), label: 'Coralia — reefs & sea caves', votes: 0 },
            { id: uid(), label: 'Highvale — mountains & raptors', votes: 0 },
            { id: uid(), label: 'Bloomwood — flowers & pollinators', votes: 0 },
          ],
        },
        {
          id: uid(),
          title: 'Pick a new Navatar companion',
          createdAt: new Date().toISOString(),
          choices: [
            { id: uid(), label: 'Red Panda', votes: 0 },
            { id: uid(), label: 'Sea Turtle', votes: 0 },
            { id: uid(), label: 'Snowy Owl', votes: 0 },
          ],
        },
      ];
      savePolls(seed);
      setPolls(seed);
    } else setPolls(p);

    const b = loadBoard();
    if (b.length === 0) {
      const seedB: BoardPost[] = [
        {
          id: uid(),
          title: 'Beach cleanup — Pacifica (Sat)',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          location: 'Pacifica • Shell Bay',
          details: 'Bags & gloves provided. Family friendly.',
          rsvps: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: uid(),
          title: 'Tree planting — Africani Park',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          location: 'Africani • Lion’s Gate',
          details: 'Help plant 50 native saplings.',
          rsvps: 5,
          createdAt: new Date().toISOString(),
        },
      ];
      saveBoard(seedB);
      setBoard(seedB);
    } else setBoard(b);
  }, []);

  const totalVotes = (p: Poll) => p.choices.reduce((s, c) => s + c.votes, 0);
  const sortedBoard = useMemo(
    () => [...board].sort((a, b) => (a.date || a.createdAt).localeCompare(b.date || b.createdAt)),
    [board],
  );

  /* Create poll */
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newOptions, setNewOptions] = useState<string>('Option A\nOption B');
  const addPoll = () => {
    const opts = newOptions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!newPollTitle.trim() || opts.length < 2) return;
    const poll: Poll = {
      id: uid(),
      title: newPollTitle.trim(),
      createdAt: new Date().toISOString(),
      choices: opts.map((o) => ({ id: uid(), label: o, votes: 0 })),
    };
    const list = [poll, ...polls];
    savePolls(list);
    setPolls(list);
    setNewPollTitle('');
    setNewOptions('Option A\nOption B');
  };

  /* Create board post */
  const [post, setPost] = useState<BoardPost>({
    id: '',
    title: '',
    date: '',
    location: '',
    details: '',
    rsvps: 0,
    createdAt: '',
  } as BoardPost);

  const addPost = () => {
    if (!post.title.trim()) return;
    const item: BoardPost = {
      ...post,
      id: uid(),
      title: post.title.trim(),
      createdAt: new Date().toISOString(),
      rsvps: 0,
    };
    const list = [item, ...board];
    saveBoard(list);
    setBoard(list);
    setPost({ id: '', title: '', date: '', location: '', details: '', rsvps: 0, createdAt: '' } as BoardPost);
  };

  return (
    <main id="main">
      <Breadcrumbs />
      <h1>🗳️🌍 Community</h1>
      <p>Vote for new lands & characters, and join local volunteer events.</p>

      <div className="tabs" role="tablist" aria-label="Community">
        <button className="tab" aria-selected={tab === 'polls'} onClick={() => setTab('polls')}>
          Polls
        </button>
        <button className="tab" aria-selected={tab === 'board'} onClick={() => setTab('board')}>
          Volunteer Board
        </button>
        <button className="tab" aria-selected={tab === 'coming'} onClick={() => setTab('coming')}>
          Coming Soon
        </button>
      </div>

      {tab === 'polls' && (
        <section className="polls">
          <div className="panel">
            <h2>Create a Poll</h2>
            <input
              className="input"
              placeholder="Poll title"
              value={newPollTitle}
              onChange={(e) => setNewPollTitle(e.target.value)}
            />
            <textarea
              className="textarea"
              rows={4}
              value={newOptions}
              onChange={(e) => setNewOptions(e.target.value)}
              placeholder={'One option per line'}
            />
            <button className="btn" onClick={addPoll}>
              Add Poll
            </button>
            <p className="meta">Client-only; votes are stored in your browser.</p>
          </div>

          <div className="poll-list">
            {polls.map((p) => {
              const total = totalVotes(p) || 1;
              const voted = hasVoted(p.id);
              return (
                <div key={p.id} className="poll-card">
                  <div className="poll-title">{p.title}</div>
                  {p.notes && <div className="poll-notes">{p.notes}</div>}

                  <div className="poll-options">
                    {p.choices.map((c) => {
                      const pct = Math.round((c.votes / total) * 100);
                      return (
                        <button
                          key={c.id}
                          className={'poll-option' + (voted ? ' voted' : '')}
                          onClick={() => {
                            if (voted) return;
                            const ok = submitVote(p.id, c.id);
                            if (ok) setPolls(loadPolls());
                          }}
                          aria-label={`Vote ${c.label}`}
                          disabled={voted}
                        >
                          <span>{c.label}</span>
                          <span className="pct">{pct}%</span>
                          <span className="bar">
                            <i style={{ width: `${pct}%` }} />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="poll-foot">
                    <span className="meta">Total votes: {totalVotes(p)}</span>
                    {voted && <span className="tag">Thanks for voting!</span>}
                  </div>
                </div>
              );
            })}
            {polls.length === 0 && <p className="meta">No polls yet.</p>}
          </div>
        </section>
      )}

      {tab === 'board' && (
        <section className="board">
          <div className="panel">
            <h2>Post a Volunteer Event</h2>
            <input
              className="input"
              placeholder="Title (e.g., Park cleanup)"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <div className="row">
              <input
                className="input"
                type="date"
                value={post.date?.slice(0, 10) || ''}
                onChange={(e) => setPost({ ...post, date: e.target.value })}
              />
              <input
                className="input"
                placeholder="Location"
                value={post.location || ''}
                onChange={(e) => setPost({ ...post, location: e.target.value })}
              />
            </div>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Details"
              value={post.details || ''}
              onChange={(e) => setPost({ ...post, details: e.target.value })}
            />
            <button className="btn" onClick={addPost}>
              Add Event
            </button>
            <p className="meta">Client-only; RSVPs are local for now.</p>
          </div>

          <div className="board-list">
            {sortedBoard.map((x) => (
              <div key={x.id} className="board-card">
                <div className="board-title">{x.title}</div>
                <div className="meta">
                  {x.date && <>📅 {new Date(x.date).toLocaleDateString()} · </>}
                  {x.location && <>📍 {x.location}</>}
                </div>
                {x.details && <p className="board-details">{x.details}</p>}
                <div className="actions">
                  <button
                    className="btn outline"
                    onClick={() => {
                      rsvp(x.id);
                      setBoard(loadBoard());
                    }}
                  >
                    RSVP • {x.rsvps}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'coming' && (
        <section>
          <h2>Coming Soon</h2>
          <ul>
            <li>Verified community profiles & chapters per kingdom.</li>
            <li>Cause matching, donations, and brand partners via Naturversity.</li>
            <li>On-chain votes with NATUR coin.</li>
          </ul>
        </section>
      )}
    </main>
  );
}
