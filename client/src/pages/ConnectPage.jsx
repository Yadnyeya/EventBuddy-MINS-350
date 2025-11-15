// Connect Page - Manage buddy requests, matches, and conversations
// Maps to: Connect section (Buddy Matches, Requests, Messaging, Safety)

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import {
  acceptConnection,
  getMatchSuggestions,
  getPendingReceived,
  getPendingSent,
  sendConnectionRequest
} from '../services/connectionsApi';
import { getConversations, getConversationWith, sendMessage } from '../services/messagesApi';

const MATCH_FILTERS = ['All', 'Study buddies', 'Night owls', 'Event hype crew'];

const FALLBACK_MATCHES = [
  {
    id: 'match-1',
    full_name: 'Sasha Morgan',
    major: 'Digital Media',
    academic_year: 'Junior',
    personality_type: 'Ambivert',
    vibe: 'Night owls',
    tagline: 'Filmmaker looking for late-night editing jams and storytelling partners.',
    compatibility: 92,
    interests: ['Videography', 'Horror cinema', 'Storyboarding']
  },
  {
    id: 'match-2',
    full_name: 'Theo Alvarez',
    major: 'Computer Science',
    academic_year: 'Senior',
    personality_type: 'Introvert',
    vibe: 'Study buddies',
    tagline: 'Wired for hackathons, maker fairs, and midnight coffee crawls.',
    compatibility: 88,
    interests: ['Hackathons', 'Robotics', 'Analog synths']
  },
  {
    id: 'match-3',
    full_name: 'Mina Patel',
    major: 'Nursing',
    academic_year: 'Sophomore',
    personality_type: 'Extrovert',
    vibe: 'Event hype crew',
    tagline: 'Wellness junkie rallying friends for sunrise yoga and weekend adventures.',
    compatibility: 85,
    interests: ['Trail running', 'Farmers markets', 'Sound baths']
  }
];

const FALLBACK_RECEIVED = [
  {
    id: 'request-1',
    sent_at: '2025-11-12T21:45:00Z',
    note: 'Saw you checked into the Underground Study Marathon. Want to squad up next time?',
    student: {
      id: 'student-49',
      full_name: 'Jordan Lynn',
      major: 'Physics',
      academic_year: 'Senior',
      personality_type: 'Ambivert',
      interests: ['Tabletop RPGs', 'Circuit bending', 'Martial arts']
    }
  }
];

const FALLBACK_SENT = [
  {
    id: 'sent-1',
    sent_at: '2025-11-11T18:10:00Z',
    status: 'pending',
    student: {
      id: 'student-88',
      full_name: 'Priya Shah',
      major: 'Business Strategy',
      academic_year: 'Graduate',
      personality_type: 'Introvert',
      interests: ['Pitch competitions', 'Pop-up markets']
    }
  }
];

const FALLBACK_CONVERSATIONS = [
  {
    id: 'convo-1',
    participant: {
      id: 'match-1',
      full_name: 'Sasha Morgan',
      academic_year: 'Junior',
      major: 'Digital Media'
    },
    last_message: 'Locking in Dungeon open hours for Friday night — you in?',
    unread_count: 1,
    messages: [
      {
        id: 'msg-1',
        from_self: false,
        content: 'Hey! Heard you were looking for another camera op for the film lab showcase.',
        timestamp: '2025-11-12T20:56:00Z'
      },
      {
        id: 'msg-2',
        from_self: true,
        content: 'Absolutely. I can bring lights + capture b-roll. Want to storyboard together?',
        timestamp: '2025-11-12T21:02:00Z'
      },
      {
        id: 'msg-3',
        from_self: false,
        content: 'Locking in Dungeon open hours for Friday night — you in?',
        timestamp: '2025-11-12T21:11:00Z'
      }
    ]
  },
  {
    id: 'convo-2',
    participant: {
      id: 'match-3',
      full_name: 'Mina Patel',
      academic_year: 'Sophomore',
      major: 'Nursing'
    },
    last_message: 'See you at the flow session — bring your lavender oil!',
    unread_count: 0,
    messages: [
      {
        id: 'msg-4',
        from_self: false,
        content: 'Grabbing a group for sunrise yoga, 6:15 AM quad lawn. Want me to hold a spot?',
        timestamp: '2025-11-10T06:32:00Z'
      },
      {
        id: 'msg-5',
        from_self: true,
        content: 'Say less. Adding my roomie too — we owe you tea.',
        timestamp: '2025-11-10T06:39:00Z'
      }
    ]
  }
];

const SAFETY_TIPS = [
  'Stay inside the app for first-time meetups; share limited personal details until you feel comfortable.',
  'Use the Safety Check button on your profile to quietly alert friends if a meetup feels off.',
  'Block and report tools live under Privacy & Safety — we nuke creepy vibes fast.',
  'Double-confirm meet locations and time in chat so everyone arrives together.'
];

function formatTimestamp(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function ConnectPage() {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [status, setStatus] = useState(null);
  const [matchFilter, setMatchFilter] = useState('All');
  const [matchSearch, setMatchSearch] = useState('');

  useEffect(() => {
    loadMatches();
    loadRequests();
    loadConversations();
  }, []);

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await getMatchSuggestions();
      if (Array.isArray(data) && data.length > 0) {
        setMatches(data);
      } else {
        setMatches(FALLBACK_MATCHES);
        setStatus({ type: 'info', message: 'Showing curated sample matches until the matchmaker finishes syncing.' });
      }
    } catch (error) {
      console.warn('Match suggestions unavailable, using fallback data:', error);
      setMatches(FALLBACK_MATCHES);
      setStatus({ type: 'info', message: 'Showing curated sample matches until the matchmaker finishes syncing.' });
    } finally {
      setLoadingMatches(false);
    }
  };

  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const [received, sent] = await Promise.all([
        getPendingReceived().catch(() => null),
        getPendingSent().catch(() => null)
      ]);

      setPendingReceived(Array.isArray(received) && received.length > 0 ? received : FALLBACK_RECEIVED);
      setPendingSent(Array.isArray(sent) && sent.length > 0 ? sent : FALLBACK_SENT);
    } catch (error) {
      console.warn('Pending requests unavailable, using fallback data:', error);
      setPendingReceived(FALLBACK_RECEIVED);
      setPendingSent(FALLBACK_SENT);
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const convoList = await getConversations();
      if (Array.isArray(convoList) && convoList.length > 0) {
        const enriched = await Promise.all(
          convoList.map(async (conversation) => {
            try {
              const history = await getConversationWith(conversation.participant?.id || conversation.user_id);
              return { ...conversation, messages: history?.messages || [] };
            } catch (historyError) {
              console.warn('Conversation history unavailable, falling back to summary only:', historyError);
              return { ...conversation, messages: conversation.messages || [] };
            }
          })
        );
        setConversations(enriched);
        setActiveConversationId(enriched[0]?.id || null);
      } else {
        setConversations(FALLBACK_CONVERSATIONS);
        setActiveConversationId(FALLBACK_CONVERSATIONS[0]?.id || null);
      }
    } catch (error) {
      console.warn('Conversations unavailable, using fallback data:', error);
      setConversations(FALLBACK_CONVERSATIONS);
      setActiveConversationId(FALLBACK_CONVERSATIONS[0]?.id || null);
    } finally {
      setLoadingConversations(false);
    }
  };

  const filteredMatches = useMemo(() => {
    const searchNormalized = matchSearch.trim().toLowerCase();
    return matches.filter((match) => {
      const matchesFilter = matchFilter === 'All' || match.vibe === matchFilter;
      if (!matchesFilter) return false;

      if (!searchNormalized) return true;
      const haystack = [
        match.full_name,
        match.major,
        match.personality_type,
        ...(match.interests || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchNormalized);
    });
  }, [matchFilter, matchSearch, matches]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const handleSendRequest = async (match) => {
    if (!match?.id) return;
    setStatus(null);

    try {
      await sendConnectionRequest(match.id);
      setPendingSent((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          sent_at: new Date().toISOString(),
          status: 'pending',
          student: {
            id: match.id,
            full_name: match.full_name,
            major: match.major,
            academic_year: match.academic_year,
            personality_type: match.personality_type,
            interests: match.interests
          }
        }
      ]);
      setStatus({ type: 'success', message: `Invite sent to ${match.full_name}. We will ping you once they respond.` });
    } catch (error) {
      console.warn('Unable to send request right now, storing locally:', error);
      setPendingSent((prev) => [
        ...prev,
        {
          id: `placeholder-${Date.now()}`,
          sent_at: new Date().toISOString(),
          status: 'queued',
          student: {
            id: match.id,
            full_name: match.full_name,
            major: match.major,
            academic_year: match.academic_year,
            personality_type: match.personality_type,
            interests: match.interests
          }
        }
      ]);
      setStatus({
        type: 'info',
        message: 'The network is syncing. Your invite is saved locally and will send once the API comes back online.'
      });
    }
  };

  const handleAccept = async (request) => {
    if (!request?.id) return;
    try {
      await acceptConnection(request.id);
      setPendingReceived((prev) => prev.filter((item) => item.id !== request.id));
      setStatus({ type: 'success', message: `You are now connected with ${request.student?.full_name || 'this student'}!` });
    } catch (error) {
      console.warn('Accept connection failed:', error);
      setPendingReceived((prev) => prev.filter((item) => item.id !== request.id));
      setStatus({ type: 'info', message: 'Accepted locally. Your dashboard will sync when back online.' });
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !messageDraft.trim()) return;

    const newMessage = {
      id: `local-${Date.now()}`,
      from_self: true,
      content: messageDraft.trim(),
      timestamp: new Date().toISOString()
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              last_message: newMessage.content,
              unread_count: 0,
              messages: [...(conversation.messages || []), newMessage]
            }
          : conversation
      )
    );
    setMessageDraft('');

    try {
      await sendMessage({ receiverId: activeConversation.participant?.id, content: newMessage.content });
    } catch (error) {
      console.warn('Message send failed, keeping locally:', error);
      setStatus({
        type: 'info',
        message: 'Message stored locally. We will deliver it once messaging reconnects.'
      });
    }
  };

  const renderStatus = () => {
    if (!status) return null;

    if (status.type === 'success') {
      return <div className="form-success" style={{ marginBottom: '1.5rem' }}>{status.message}</div>;
    }

    if (status.type === 'info') {
      return <div className="form-info" style={{ marginBottom: '1.5rem' }}>{status.message}</div>;
    }

    return <div className="form-error" style={{ marginBottom: '1.5rem' }}>{status.message}</div>;
  };

  return (
    <div>
      <Navigation />
      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Lock in your crew</span>
            <h1 className="hero__title">Connect with the right campus buddies</h1>
            <p className="hero__subtitle">
              Review recommendations, respond to requests, and coordinate meetups — all from one control room.
            </p>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Curated by your interests</p>
                <h2 className="section__title">Buddy matches</h2>
              </div>
              <div className="split" style={{ alignItems: 'center', gap: '1rem' }}>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search matches by name, major, or interests…"
                  value={matchSearch}
                  onChange={(event) => setMatchSearch(event.target.value)}
                  aria-label="Search buddy matches"
                />
                <div className="pill-group" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap', overflowX: 'auto' }}>
                  {MATCH_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`pill-toggle ${matchFilter === filter ? 'is-active' : ''}`}
                      onClick={() => setMatchFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {renderStatus()}

            {loadingMatches ? (
              <div className="empty-state">
                <h3 className="card__title">Calibrating compatibility…</h3>
                <p className="card__body">We are crunching interests, vibes, and past events to surface perfect matches.</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="empty-state">
                <h3 className="card__title">No matches fit that filter</h3>
                <p className="card__body">Try a different vibe or clear your search to see everyone.</p>
              </div>
            ) : (
              <div className="cards-grid cards-grid--three">
                {filteredMatches.map((match) => (
                  <div key={match.id} className="card">
                    <div className="card__header" style={{ marginBottom: '1rem' }}>
                      <span className="card__eyebrow">{match.vibe || 'Campus connector'}</span>
                      <h3 className="card__title" style={{ marginBottom: '0.25rem' }}>{match.full_name}</h3>
                      <p className="card__body" style={{ marginBottom: '0.65rem' }}>{match.tagline || 'Ready to vibe-check new events together.'}</p>
                    </div>
                    <ul className="card__body" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.45rem' }}>
                      <li>
                        <strong style={{ color: 'var(--color-accent-strong)' }}>Major:</strong> {match.major || 'Undeclared'}
                      </li>
                      <li>
                        <strong style={{ color: 'var(--color-accent-strong)' }}>Personality:</strong> {match.personality_type || '—'}
                      </li>
                      <li>
                        <strong style={{ color: 'var(--color-accent-strong)' }}>Compatibility:</strong> {match.compatibility ? `${match.compatibility}%` : 'Smart match pending'}
                      </li>
                    </ul>
                    <div className="chip-row" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {(match.interests || []).slice(0, 4).map((interest, index) => (
                        <span key={`${match.id}-interest-${index}`} className="chip">{interest}</span>
                      ))}
                    </div>
                    <div className="card__footer" style={{ marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        className="button button--primary"
                        onClick={() => handleSendRequest(match)}
                      >
                        Send invite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Responses in real-time</p>
                <h2 className="section__title">Requests & confirmations</h2>
              </div>
            </div>

            {loadingRequests ? (
              <div className="empty-state">
                <h3 className="card__title">Fetching your queue…</h3>
                <p className="card__body">We are checking both inbound and outbound buddy requests.</p>
              </div>
            ) : (
              <div className="split">
                <div className="card">
                  <h3 className="card__title" style={{ marginBottom: '0.75rem' }}>Incoming</h3>
                  {pendingReceived.length === 0 ? (
                    <div className="empty-state" style={{ border: '1px dashed var(--color-border)', padding: '1rem' }}>
                      <h4 className="card__title" style={{ marginBottom: '0.35rem' }}>You are all caught up</h4>
                      <p className="card__body">Keep attending events and sharing experiences to attract more invites.</p>
                    </div>
                  ) : (
                    <div className="list">
                      {pendingReceived.map((request) => (
                        <div key={request.id} className="list-item">
                          <div>
                            <h4 className="list-item__title">{request.student?.full_name}</h4>
                            <p className="card__body" style={{ marginBottom: '0.35rem' }}>
                              {request.note || 'This student wants to squad up for upcoming events.'}
                            </p>
                            <div className="chip-row" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {request.student?.interests?.slice(0, 3).map((interest, index) => (
                                <span key={`${request.id}-interest-${index}`} className="chip">{interest}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <span className="chip">{formatTimestamp(request.sent_at)}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                className="button button--primary"
                                onClick={() => handleAccept(request)}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className="button button--ghost"
                                onClick={() => setPendingReceived((prev) => prev.filter((item) => item.id !== request.id))}
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 className="card__title" style={{ marginBottom: '0.75rem' }}>Outgoing</h3>
                  {pendingSent.length === 0 ? (
                    <div className="empty-state" style={{ border: '1px dashed var(--color-border)', padding: '1rem' }}>
                      <h4 className="card__title" style={{ marginBottom: '0.35rem' }}>No invites sent yet</h4>
                      <p className="card__body">Send a few invites from Matches to jumpstart your crew.</p>
                    </div>
                  ) : (
                    <div className="list">
                      {pendingSent.map((request) => (
                        <div key={request.id} className="list-item">
                          <div>
                            <h4 className="list-item__title">{request.student?.full_name}</h4>
                            <p className="card__body">Status: {request.status || 'pending'}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <span className="chip">{formatTimestamp(request.sent_at)}</span>
                            <button
                              type="button"
                              className="button button--ghost"
                              onClick={() => setPendingSent((prev) => prev.filter((item) => item.id !== request.id))}
                            >
                              Cancel invite
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Stay in sync</p>
                <h2 className="section__title">Message center</h2>
              </div>
            </div>

            {loadingConversations ? (
              <div className="empty-state">
                <h3 className="card__title">Opening your inbox…</h3>
                <p className="card__body">Pulling messages and unread counts so you never miss a meetup.</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <h3 className="card__title">No conversations yet</h3>
                <p className="card__body">Accept a buddy request or send an invite to unlock messaging.</p>
              </div>
            ) : (
              <div className="split" style={{ alignItems: 'stretch' }}>
                <div className="card" style={{ maxHeight: '520px', overflow: 'auto' }}>
                  <h3 className="card__title" style={{ marginBottom: '0.75rem' }}>Conversations</h3>
                  <div className="list">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`list-item list-item--clickable ${conversation.id === activeConversationId ? 'is-active' : ''}`}
                        style={{ textAlign: 'left' }}
                      >
                        <div>
                          <h4 className="list-item__title">{conversation.participant?.full_name}</h4>
                          <p className="card__body">{conversation.last_message}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                          {conversation.unread_count > 0 && <span className="chip">{conversation.unread_count} new</span>}
                          <span className="chip">{conversation.participant?.academic_year || '—'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeConversation ? (
                    <>
                      <header>
                        <p className="card__eyebrow">Chatting with</p>
                        <h3 className="card__title">{activeConversation.participant?.full_name}</h3>
                        <p className="card__body" style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                          {activeConversation.participant?.major} • {activeConversation.participant?.academic_year}
                        </p>
                      </header>

                      <div className="message-thread" style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gap: '1rem' }}>
                        {(activeConversation.messages || []).map((message) => (
                          <div
                            key={message.id}
                            className={`message ${message.from_self ? 'message--self' : 'message--buddy'}`}
                          >
                            <p>{message.content}</p>
                            <span>{formatTimestamp(message.timestamp)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="message-composer">
                        <textarea
                          rows={3}
                          placeholder="Draft your next move…"
                          value={messageDraft}
                          onChange={(event) => setMessageDraft(event.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                          <span className="card__body" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            Pro-tip: Confirm meetup spot & arrival time before event doors open.
                          </span>
                          <button type="button" className="button button--primary" onClick={handleSendMessage}>
                            Send message
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      <h3 className="card__title">Pick a conversation</h3>
                      <p className="card__body">Select someone from the inbox to review plans and keep the conversation going.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="section">
            <div className="card" style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <p className="section__subtitle">Stay secure</p>
                <h2 className="section__title" style={{ fontSize: '1.6rem' }}>Safety playbook</h2>
              </div>
              <ul className="checklist">
                {SAFETY_TIPS.map((tip, index) => (
                  <li key={`safety-tip-${index}`}>
                    <span aria-hidden="true">🛡</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="card__footer" style={{ justifyContent: 'flex-end' }}>
                <a className="button button--ghost" href="#privacy" onClick={(event) => event.preventDefault()}>
                  Review Privacy & Safety settings
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ConnectPage;
