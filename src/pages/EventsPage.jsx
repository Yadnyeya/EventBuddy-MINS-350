// Events Page - Browse and search events
// Maps to: Find Events section (Browse, Search by Type)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../services/eventsApi';
import Navigation from '../components/Navigation';

const EVENT_TYPES = ['', 'Event', 'Club Meeting', 'Fair'];

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters = eventType ? { event_type: eventType, limit: 24 } : { limit: 24 };
      const data = await getAllEvents(filters);
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([
        {
          event_id: '1',
          title: 'Study Group - Computer Science',
          description: 'Weekly study session for CS majors. Bring your laptops and questions!',
          location: 'Library Room 204',
          date_and_time: '2025-11-15T18:00:00Z',
          event_type: 'Club Meeting',
          attendance: 12,
          host: { email: 'john.doe@university.edu', year: 'Junior' }
        },
        {
          event_id: '2',
          title: 'Campus Activities Fair',
          description: 'Discover clubs and organizations. Free food and giveaways!',
          location: 'Student Union Hall',
          date_and_time: '2025-11-18T10:00:00Z',
          event_type: 'Fair',
          attendance: 150,
          host: { email: 'mike.johnson@university.edu', year: 'Senior' }
        },
        {
          event_id: '3',
          title: 'Photography Walk',
          description: 'Join us for a photography walk around campus. All skill levels welcome!',
          location: 'Campus Quad',
          date_and_time: '2025-11-16T14:00:00Z',
          event_type: 'Event',
          attendance: 8,
          host: { email: 'jane.smith@university.edu', year: 'Sophomore' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [eventType]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (value) => {
    if (!value) return 'TBA';
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Navigation />

      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Discover the underground</span>
            <h1 className="hero__title">Plan your next campus night</h1>
            <p className="hero__subtitle">
              Filter by vibes, browse handcrafted picks, and find the experiences that keep your social calendar lit.
            </p>
            <div className="hero__actions">
              <Link to="/events/create" className="button button--primary">
                Create Event
              </Link>
              <Link to="/share" className="button button--ghost">
                Share Feedback
              </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Refine the hunt</p>
                <h2 className="section__title">Filter Events</h2>
              </div>
              {eventType && (
                <button type="button" className="button button--ghost" onClick={() => setEventType('')}>
                  Clear filters
                </button>
              )}
            </div>
            <div className="pill-group">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type || 'all'}
                  type="button"
                  className={`pill-toggle ${eventType === type ? 'is-active' : ''}`}
                  onClick={() => setEventType(type)}
                >
                  {type || 'All Events'}
                </button>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Live listings</p>
                <h2 className="section__title">Events On Deck</h2>
              </div>
              <p className="card__body">{loading ? 'Fetching the latest happenings…' : `${events.length} events ready to explore.`}</p>
            </div>

            {loading ? (
              <div className="empty-state">
                <h3 className="card__title">Loading events</h3>
                <p className="card__body">Give us a moment while we assemble the lineup.</p>
              </div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <h3 className="card__title">No events found</h3>
                <p className="card__body">Try adjusting the filters or check back soon—fresh events land daily.</p>
                <button type="button" className="button button--primary" onClick={() => setEventType('')}>
                  View all events
                </button>
              </div>
            ) : (
              <div className="event-grid">
                {events.map((event) => (
                  <Link key={event.event_id} to={`/events/${event.event_id}`} className="event-card">
                    <div className="badge">
                      <span aria-hidden="true">🏷</span>
                      {event.event_type || 'General'}
                    </div>
                    <h3 className="card__title">{event.title}</h3>
                    <p className="card__body">{event.description}</p>
                    <div className="event-card__meta">
                      <span>
                        <span aria-hidden="true">📅</span>
                        {formatDate(event.date_and_time)}
                      </span>
                      <span>
                        <span aria-hidden="true">📍</span>
                        {event.location || 'Across campus'}
                      </span>
                      {event.host?.email && (
                        <span>
                          <span aria-hidden="true">🎟</span>
                          Hosted by {event.host.email.split('@')[0]}
                        </span>
                      )}
                    </div>
                    <div className="event-card__footer">
                      <span>{event.attendance ? `${event.attendance} going` : 'Be first to join'}</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default EventsPage;
