// Share Experience Page - Rate and recommend events
// Maps to: Share Experience section (Post Feedback, Rate Exp)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAttendance, rateEvent } from '../services/attendApi';
import Navigation from '../components/Navigation';

const RATING_LABELS = {
  0: 'Select a rating to begin',
  1: 'Barely worth the time',
  2: 'Had its moments',
  3: 'Solid campus experience',
  4: 'Would recommend to friends',
  5: 'Instant classic'
};

function ShareExperiencePage() {
  const [attendance, setAttendance] = useState([]);
  const [selectedAttend, setSelectedAttend] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const data = await getMyAttendance();
      const unrated = data?.filter((entry) => !entry.rating) || [];
      setAttendance(
        unrated.length > 0
          ? unrated
          : [
              {
                attend_id: 1,
                event_title: 'Study Group Session',
                timestamp_start: new Date('2025-01-15T14:00:00').toISOString()
              },
              {
                attend_id: 2,
                event_title: 'Campus Fair',
                timestamp_start: new Date('2025-01-12T10:00:00').toISOString()
              }
            ]
      );
    } catch (error) {
      console.error('Error loading attendance:', error);
      setAttendance([
        {
          attend_id: 1,
          event_title: 'Study Group Session',
          timestamp_start: new Date('2025-01-15T14:00:00').toISOString()
        },
        {
          attend_id: 2,
          event_title: 'Campus Fair',
          timestamp_start: new Date('2025-01-12T10:00:00').toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (event) => {
    event.preventDefault();

    if (!selectedAttend) {
      setFeedback({ type: 'error', message: 'Pick an event you attended before leaving a review.' });
      return;
    }

    if (rating === 0) {
      setFeedback({ type: 'error', message: 'Choose a rating to share how the night went.' });
      return;
    }

    try {
      await rateEvent(selectedAttend, rating, comment);
      setFeedback({ type: 'success', message: 'Thanks for dropping your experience. Keep the vibes going!' });
      setSelectedAttend('');
      setRating(0);
      setComment('');
      loadAttendance();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setFeedback({ type: 'error', message: 'Could not submit your review. Try again in a bit.' });
    }
  };

  const renderStatus = () => {
    if (!feedback) return null;
    if (feedback.type === 'success') {
      return <div className="form-success">{feedback.message}</div>;
    }
    return <div className="form-error">{feedback.message}</div>;
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <main className="page">
          <div className="container">
            <section className="section">
              <div className="empty-state">
                <h2 className="card__title">Loading attendance</h2>
                <p className="card__body">Grabbing the events you checked into…</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Spread the legend</span>
            <h1 className="hero__title">Share Your Experience</h1>
            <p className="hero__subtitle">Drop ratings, trade insider tips, and help fellow students choose their next night out.</p>
            <div className="hero__actions">
              <Link to="/events" className="button button--primary">
                Find new events
              </Link>
              <Link to="/profile" className="button button--ghost">
                View your history
              </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="card">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Your voice matters</p>
                  <h2 className="section__title">Rate a recent event</h2>
                </div>
              </div>

              {renderStatus()}

              {attendance.length === 0 ? (
                <div className="empty-state">
                  <h3 className="card__title">All caught up</h3>
                  <p className="card__body">You have reviewed every event. Hit another gathering and come back with intel.</p>
                  <Link to="/events" className="button button--primary">
                    Browse events
                  </Link>
                </div>
              ) : (
                <form className="form" onSubmit={handleSubmitRating}>
                  <div className="form-field">
                    <label htmlFor="attendance">Pick an event</label>
                    <select
                      id="attendance"
                      value={selectedAttend}
                      onChange={(event) => setSelectedAttend(event.target.value)}
                    >
                      <option value="">Select an event you checked into…</option>
                      {attendance.map((record) => (
                        <option key={record.attend_id} value={record.attend_id}>
                          {record.event_title} —
                          {' '}
                          {new Date(record.timestamp_start).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="card card--accent" style={{ borderColor: 'rgba(198, 133, 58, 0.25)' }}>
                    <span className="card__eyebrow">Rate the vibe</span>
                    <div className="hero__actions" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`button button--ghost ${rating === value ? 'is-active' : ''}`}
                          onClick={() => setRating(value)}
                        >
                          <span aria-hidden="true">{value <= rating ? '★' : '☆'}</span>
                          <span className="mobile-only">{value}</span>
                        </button>
                      ))}
                    </div>
                    <p className="card__body" style={{ marginTop: '1rem' }}>{RATING_LABELS[rating]}</p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="comment">Share highlights (optional)</label>
                    <textarea
                      id="comment"
                      rows={5}
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="What stood out? Would you attend again?"
                    />
                  </div>

                  <button type="submit" className="button button--primary">
                    Submit experience
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ShareExperiencePage;
