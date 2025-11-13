// Event Detail Page - View single event details
// Maps to: Find Events > Event Details, Check In

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventsApi';
import { checkInToEvent, getEventRatings } from '../services/attendApi';
import Navigation from '../components/Navigation';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({ ratings: [], average: 0, count: 0 });
  const [checkedIn, setCheckedIn] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadEvent = useCallback(async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
      setEvent({
        event_id: id,
        title: 'Study Group - Computer Science',
        description:
          'Weekly study session for CS majors. Bring your laptops and questions! We will be covering topics from Data Structures and Algorithms.',
        location: 'Library Room 204',
        date_and_time: '2025-11-15T18:00:00Z',
        event_type: 'Club Meeting',
        attendance: 12,
        host: {
          student_id: '1',
          email: 'john.doe@university.edu',
          year: 'Junior'
        }
      });
    }
  }, [id]);

  const loadRatings = useCallback(async () => {
    try {
      const data = await getEventRatings(id);
      setRatings(data);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  }, [id]);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadEvent(), loadRatings()]);
      if (isActive) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [loadEvent, loadRatings]);

  const handleCheckIn = async () => {
    try {
      await checkInToEvent(id, []);
      setCheckedIn(true);
      setFeedback('You are checked in—enjoy the experience!');
    } catch (error) {
      console.error('Error checking in:', error);
      setFeedback('Unable to check in. Please try again.');
    }
  };

  const formatDateLong = (value) => {
    if (!value) return 'Date to be announced';
    return new Date(value).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (value) => {
    if (!value) return 'Time TBA';
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderLoadingState = (message) => (
    <div>
      <Navigation />
      <main className="page">
        <div className="container">
          <section className="section">
            <div className="empty-state">
              <h2 className="card__title">{message}</h2>
              <p className="card__body">Hang tight while we fetch the event details.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );

  if (loading) {
    return renderLoadingState('Loading event');
  }

  if (!event) {
    return renderLoadingState('Event not found');
  }

  return (
    <div>
      <Navigation />
      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Event dossier</span>
            <h1 className="hero__title">{event.title}</h1>
            <p className="hero__subtitle">{event.description}</p>
            <div className="hero__actions">
              <button type="button" className="button button--ghost" onClick={() => navigate('/events')}>
                ← Back to events
              </button>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="card card--accent">
              <div className="badge">
                <span aria-hidden="true">🏷</span>
                {event.event_type || 'Campus Event'}
              </div>
              <div className="rating-display">
                <div>
                  <p className="card__body">Hosted by {event.host?.email?.split('@')[0] || 'EventBuddy'}</p>
                  <p className="card__body">{event.host?.year ? `Class of ${event.host.year}` : 'All years welcome'}</p>
                </div>
                {ratings.count > 0 && (
                  <div>
                    <div className="rating-display__value">{ratings.average.toFixed(1)}</div>
                    <div className="rating-display__count">{ratings.count} {ratings.count === 1 ? 'review' : 'reviews'}</div>
                  </div>
                )}
              </div>

              <div className="grid-two">
                <div className="card card--accent" style={{ borderColor: 'rgba(198, 133, 58, 0.25)' }}>
                  <span className="card__eyebrow">When</span>
                  <h3 className="card__title">{formatDateLong(event.date_and_time)}</h3>
                  <p className="card__body">Starts at {formatTime(event.date_and_time)}</p>
                </div>
                <div className="card card--accent" style={{ borderColor: 'rgba(198, 133, 58, 0.25)' }}>
                  <span className="card__eyebrow">Where</span>
                  <h3 className="card__title">{event.location || 'Location coming soon'}</h3>
                  <p className="card__body">Bring your crew and check in at the entrance.</p>
                </div>
              </div>

              <div className="stat-row" style={{ marginTop: '1.5rem' }}>
                <div className="stat">
                  <p className="stat__label">Spots claimed</p>
                  <p className="stat__value">{event.attendance || 0}</p>
                  <p className="card__body">Reserve your place and show up ready.</p>
                </div>
                <div className="stat">
                  <p className="stat__label">Check-in status</p>
                  <p className="stat__value">{checkedIn ? 'Confirmed' : 'Open'}</p>
                  <p className="card__body">Tap the button below when you arrive.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card card--success">
              <div className="badge">
                <span aria-hidden="true">🎟</span>
                Event check-in
              </div>
              <h2 className="section__title" style={{ marginBottom: '1rem' }}>
                {checkedIn ? "You're in" : 'Check into the event'}
              </h2>
              <p className="card__body" style={{ marginBottom: '1.5rem' }}>
                {checkedIn
                  ? 'Catch the highlights, network with the host, and leave your review once the night wraps.'
                  : 'Confirm your presence to unlock attendee perks and make it easier to leave feedback later.'}
              </p>
              <div className="hero__actions" style={{ justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                  className="button button--primary"
                >
                  {checkedIn ? 'Checked in' : 'Check in now'}
                </button>
                <Link to="/share" className="button button--ghost">
                  Leave a review later
                </Link>
              </div>
              {feedback && <div className="form-success" style={{ marginTop: '1.5rem' }}>{feedback}</div>}
            </div>
          </section>

          {ratings.ratings && ratings.ratings.length > 0 && (
            <section className="section">
              <div className="card">
                <div className="section__header">
                  <div>
                    <p className="section__subtitle">Voices from the floor</p>
                    <h2 className="section__title">Student reviews</h2>
                  </div>
                  <Link to="/share" className="button button--outline">
                    Add your take
                  </Link>
                </div>

                <div className="reviews">
                  {ratings.ratings.map((rating, index) => (
                    <div key={index} className="review-card">
                      <div className="review-card__header">
                        <div>
                          <p className="list-item__title">{rating.student_email?.split('@')[0] || 'Participant'}</p>
                          <p className="card__body">{new Date(rating.timestamp_start).toLocaleDateString()}</p>
                        </div>
                        <div className="review-card__rating" aria-label={`Rated ${rating.rating} out of 5`}>
                          {'★'.repeat(rating.rating)}
                        </div>
                      </div>
                      {rating.shared_experience && <p className="card__body">“{rating.shared_experience}”</p>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default EventDetailPage;
