// Attend Together Page - Coordinate saved events and buddy outings
// Maps to: Attend Together section (Saved Events, Plan Builder, Invite Crew)

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import { getAllEvents } from '../services/eventsApi';
import { getAllStudents } from '../services/studentsApi';

const SAVED_EVENTS_KEY = 'eventbuddy:saved-events';
const PLANS_KEY = 'eventbuddy:attend-plans';

const FALLBACK_EVENTS = [
  {
    event_id: 'fallback-1',
    title: 'Dungeon Makers Lock-In',
    description: 'Bring your best world-building ideas for a collaborative late-night jam.',
    location: 'Innovation Lab Bunker',
    date_and_time: '2025-11-21T21:30:00Z',
    event_type: 'Club Meeting'
  },
  {
    event_id: 'fallback-2',
    title: 'Glow Up Skate Night',
    description: 'Skate, neon paint, and synthwave curated by the Campus DJs Guild.',
    location: 'Rec Center Rink',
    date_and_time: '2025-11-22T19:00:00Z',
    event_type: 'Event'
  },
  {
    event_id: 'fallback-3',
    title: 'Sunrise Reset Crew',
    description: 'Guided yoga, tea ceremony, and gratitude journaling to kick off finals week.',
    location: 'North Quad Lawn',
    date_and_time: '2025-11-24T06:15:00Z',
    event_type: 'Event'
  }
];

const FALLBACK_BUDDIES = [
  { id: 'buddy-1', name: 'Sasha Morgan', vibe: 'Late-night creator', contact: '@sasham' },
  { id: 'buddy-2', name: 'Theo Alvarez', vibe: 'Hackathon co-pilot', contact: '@theo.codes' },
  { id: 'buddy-3', name: 'Mina Patel', vibe: 'Wellness hype captain', contact: '@minamoves' },
  { id: 'buddy-4', name: 'Jordan Lynn', vibe: 'Tabletop strategist', contact: '@jlynndm' }
];

const COORDINATION_TIPS = [
  'Share arrival windows and who is grabbing snacks so the crew splits the prep.',
  'Screenshot RSVP confirmations to the group chat so everyone knows they are on the list.',
  'Pick a regroup spot if anyone gets separated — bright signage is your friend.',
  'Set a “home safe” check-in time for after the event.'
];

const defaultPlanForm = {
  eventId: '',
  meetupSpot: '',
  meetupTime: '',
  notes: '',
  invitees: []
};

function loadStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Unable to parse stored data for ${key}`, error);
    return fallback;
  }
}

function formatDate(value, withTime = false) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withTime
      ? {
          hour: '2-digit',
          minute: '2-digit'
        }
      : { year: 'numeric' })
  });
}

function AttendTogetherPage() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [savedEventIds, setSavedEventIds] = useState(() => loadStoredJson(SAVED_EVENTS_KEY, []));
  const [planForm, setPlanForm] = useState(defaultPlanForm);
  const [plans, setPlans] = useState(() => loadStoredJson(PLANS_KEY, []));
  const [buddyOptions, setBuddyOptions] = useState(FALLBACK_BUDDIES);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await getAllEvents({ limit: 12 });
        if (Array.isArray(data?.events) && data.events.length > 0) {
          setEvents(data.events);
        } else {
          setEvents(FALLBACK_EVENTS);
          setStatus({ type: 'info', message: 'Loaded sample events while the event feed catches up.' });
        }
      } catch (error) {
        console.warn('Events API unavailable, using fallback schedule:', error);
        setEvents(FALLBACK_EVENTS);
        setStatus({ type: 'info', message: 'Loaded sample events while the event feed catches up.' });
      } finally {
        setLoadingEvents(false);
      }
    };

    const loadBuddies = async () => {
      try {
        const data = await getAllStudents(20, 0);
        if (Array.isArray(data?.students) && data.students.length > 0) {
          const formatted = data.students.map((student) => ({
            id: student.student_id || student.id,
            name: student.full_name || student.email?.split('@')[0] || 'Student',
            vibe: student.year || 'Campus explorer',
            contact: student.email
          }));
          setBuddyOptions(formatted);
        } else {
          setBuddyOptions(FALLBACK_BUDDIES);
        }
      } catch (error) {
        console.warn('Student directory unavailable, using fallback crew:', error);
        setBuddyOptions(FALLBACK_BUDDIES);
      }
    };

    loadEvents();
    loadBuddies();
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  useEffect(() => {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  }, [plans]);

  const savedEvents = useMemo(
    () => events.filter((event) => savedEventIds.includes(event.event_id)),
    [events, savedEventIds]
  );

  const handleToggleSave = (eventId) => {
    setSavedEventIds((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }
      return [...prev, eventId];
    });
  };

  const handleFormChange = (field, value) => {
    setPlanForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInviteToggle = (buddyId) => {
    setPlanForm((prev) => {
      const invitees = prev.invitees.includes(buddyId)
        ? prev.invitees.filter((id) => id !== buddyId)
        : [...prev.invitees, buddyId];
      return { ...prev, invitees };
    });
  };

  const handleCreatePlan = (event) => {
    event.preventDefault();
    if (!planForm.eventId || planForm.invitees.length === 0) {
      setStatus({ type: 'error', message: 'Choose an event and at least one buddy to lock in a plan.' });
      return;
    }

    const eventDetails = events.find((item) => item.event_id === planForm.eventId) ||
      FALLBACK_EVENTS.find((item) => item.event_id === planForm.eventId);

    const plan = {
      id: `plan-${Date.now()}`,
      eventId: planForm.eventId,
      title: eventDetails?.title || 'Upcoming event',
      location: eventDetails?.location || 'TBA',
      date_and_time: eventDetails?.date_and_time,
      meetupSpot: planForm.meetupSpot || 'Lobby entrance',
      meetupTime: planForm.meetupTime || '',
      notes: planForm.notes,
      invitees: planForm.invitees,
      status: 'Coordinating',
      created_at: new Date().toISOString()
    };

    setPlans((prev) => [...prev, plan]);
    setPlanForm(defaultPlanForm);
    setStatus({ type: 'success', message: 'Outing locked in! We saved the plan to your attend-together dashboard.' });
  };

  const handleUpdatePlanStatus = (planId, nextStatus) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, status: nextStatus } : plan)));
  };

  const handleDeletePlan = (planId) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId));
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
            <span className="hero__eyebrow">Attend together</span>
            <h1 className="hero__title">Plan your crew and make events unforgettable</h1>
            <p className="hero__subtitle">
              Save events you care about, coordinate meetup details, and rally a buddy squad before doors open.
            </p>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Lineup worthy of your crew</p>
                <h2 className="section__title">Save events</h2>
              </div>
            </div>

            {renderStatus()}

            {loadingEvents ? (
              <div className="empty-state">
                <h3 className="card__title">Curating events…</h3>
                <p className="card__body">We are loading campus happenings so you can bookmark the best ones.</p>
              </div>
            ) : (
              <div className="event-grid">
                {events.map((event) => {
                  const isSaved = savedEventIds.includes(event.event_id);
                  return (
                    <div key={event.event_id} className="event-card">
                      <div className="badge">
                        <span aria-hidden="true">{isSaved ? '⭐' : '📅'}</span>
                        {event.event_type || 'Event'}
                      </div>
                      <h3 className="card__title">{event.title}</h3>
                      <p className="card__body">{event.description}</p>
                      <div className="event-card__meta">
                        <span>
                          <span aria-hidden="true">🕓</span>
                          {formatDate(event.date_and_time, true)}
                        </span>
                        <span>
                          <span aria-hidden="true">📍</span>
                          {event.location || 'TBA'}
                        </span>
                      </div>
                      <div className="event-card__footer">
                        <span>{isSaved ? 'In your squad queue' : 'Add to outing plan'}</span>
                        <button
                          type="button"
                          className={`button ${isSaved ? 'button--ghost' : 'button--primary'}`}
                          onClick={() => handleToggleSave(event.event_id)}
                        >
                          {isSaved ? 'Remove' : 'Save event'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="section">
            <div className="split">
              <div className="card" style={{ display: 'grid', gap: '1.5rem' }}>
                <header>
                  <p className="section__subtitle">Coordinate the details</p>
                  <h2 className="section__title" style={{ fontSize: '1.8rem' }}>Plan an outing</h2>
                </header>

                <form className="form" onSubmit={handleCreatePlan}>
                  <div className="form-field">
                    <label htmlFor="plan-event">Select event</label>
                    <select
                      id="plan-event"
                      value={planForm.eventId}
                      onChange={(event) => handleFormChange('eventId', event.target.value)}
                      required
                    >
                      <option value="">Choose an event…</option>
                      {savedEvents.length > 0 && (
                        <optgroup label="Saved events">
                          {savedEvents.map((event) => (
                            <option key={`saved-option-${event.event_id}`} value={event.event_id}>
                              {event.title} — {formatDate(event.date_and_time, true)}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="All events">
                        {events.map((event) => (
                          <option key={`event-option-${event.event_id}`} value={event.event_id}>
                            {event.title} — {formatDate(event.date_and_time, true)}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="plan-meetup">Meet-up spot</label>
                      <input
                        id="plan-meetup"
                        type="text"
                        placeholder="Outside venue entrance, library steps, etc."
                        value={planForm.meetupSpot}
                        onChange={(event) => handleFormChange('meetupSpot', event.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="plan-time">Meet-up time</label>
                      <input
                        id="plan-time"
                        type="time"
                        value={planForm.meetupTime}
                        onChange={(event) => handleFormChange('meetupTime', event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="plan-notes">Group notes</label>
                    <textarea
                      id="plan-notes"
                      placeholder="Transport plan, snack list, afterparty ideas…"
                      value={planForm.notes}
                      onChange={(event) => handleFormChange('notes', event.target.value)}
                    />
                  </div>

                  <div className="buddy-selector">
                    <p className="section__subtitle" style={{ marginBottom: '0.5rem' }}>Invite buddies</p>
                    <div className="buddy-grid">
                      {buddyOptions.map((buddy) => (
                        <label key={buddy.id} className={`buddy-chip ${planForm.invitees.includes(buddy.id) ? 'is-selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={planForm.invitees.includes(buddy.id)}
                            onChange={() => handleInviteToggle(buddy.id)}
                          />
                          <div>
                            <strong>{buddy.name}</strong>
                            <span>{buddy.vibe}</span>
                            <span className="chip" style={{ marginTop: '0.35rem' }}>{buddy.contact}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="button button--primary">
                      Save plan
                    </button>
                  </div>
                </form>
              </div>

              <div className="card" style={{ display: 'grid', gap: '1rem' }}>
                <header>
                  <p className="section__subtitle">Your crew calendar</p>
                  <h2 className="section__title" style={{ fontSize: '1.8rem' }}>Upcoming outings</h2>
                </header>

                {plans.length === 0 ? (
                  <div className="empty-state">
                    <h3 className="card__title">No outings yet</h3>
                    <p className="card__body">Save an event and add at least one buddy to start your plan queue.</p>
                  </div>
                ) : (
                  <div className="plans">
                    {plans.map((plan) => {
                      const eventDetails = events.find((event) => event.event_id === plan.eventId) ||
                        FALLBACK_EVENTS.find((event) => event.event_id === plan.eventId);
                      return (
                        <div key={plan.id} className="plan-card">
                          <div className="plan-card__header">
                            <h3 className="card__title">{plan.title}</h3>
                            <span className="chip">{plan.status}</span>
                          </div>
                          <div className="plan-card__meta">
                            <span>
                              <span aria-hidden="true">🗓</span>
                              {formatDate(eventDetails?.date_and_time, true)}
                            </span>
                            <span>
                              <span aria-hidden="true">📍</span>
                              {plan.meetupSpot || eventDetails?.location || 'See event details'}
                            </span>
                          </div>
                          {plan.notes && <p className="card__body">{plan.notes}</p>}
                          <div className="chip-row" style={{ marginTop: '0.75rem' }}>
                            {plan.invitees.map((inviteeId) => {
                              const buddy = buddyOptions.find((option) => option.id === inviteeId);
                              return (
                                <span key={`${plan.id}-${inviteeId}`} className="chip">
                                  {buddy?.name || 'Buddy'}
                                </span>
                              );
                            })}
                          </div>
                          <div className="plan-card__actions">
                            <button
                              type="button"
                              className="button button--ghost"
                              onClick={() => handleUpdatePlanStatus(plan.id, plan.status === 'Coordinating' ? 'Confirmed' : 'Coordinating')}
                            >
                              {plan.status === 'Coordinating' ? 'Mark confirmed' : 'Reopen plan'}
                            </button>
                            <button
                              type="button"
                              className="button button--ghost"
                              onClick={() => handleUpdatePlanStatus(plan.id, 'Wrapped')}
                            >
                              Mark attended
                            </button>
                            <button
                              type="button"
                              className="button button--ghost"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card" style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <p className="section__subtitle">Coordination playbook</p>
                <h2 className="section__title" style={{ fontSize: '1.6rem' }}>Squad tips</h2>
              </div>
              <ul className="checklist">
                {COORDINATION_TIPS.map((tip, index) => (
                  <li key={`tip-${index}`}>
                    <span aria-hidden="true">🤝</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AttendTogetherPage;
