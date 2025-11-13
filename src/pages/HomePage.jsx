// Home Page - EventBuddy Landing/Dashboard
// Main entry point after login showing overview of all features

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/supabase';
import { getAllEvents } from '../services/eventsApi';
import { getMyAttendance } from '../services/attendApi';
import Navigation from '../components/Navigation';

function HomePage() {
  const [user, setUser] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const eventsData = await getAllEvents({ limit: 3 });
      setUpcomingEvents(eventsData.events || []);

      const attendanceData = await getMyAttendance();
      setRecentAttendance(attendanceData.slice(0, 3) || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Navigation />

      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">The campus underground</span>
            <h1 className="hero__title">
              Welcome back,{' '}
              <span className="hero__accent">{user?.email?.split('@')[0] || 'Adventurer'}</span>
            </h1>
            <p className="hero__subtitle">
              Track the pulse of student life, build new connections, and experience the events shaping your community.
            </p>
            <div className="hero__actions">
              <Link to="/events" className="button button--primary">
                Browse Events
              </Link>
              <Link to="/share" className="button button--ghost">
                Share an Experience
              </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="stat-row">
              <div className="stat">
                <p className="stat__label">Upcoming</p>
                <p className="stat__value">{upcomingEvents.length}</p>
                <p className="card__body">Curated events happening soon.</p>
              </div>
              <div className="stat">
                <p className="stat__label">Recent check-ins</p>
                <p className="stat__value">{recentAttendance.length}</p>
                <p className="card__body">Latest experiences you joined.</p>
              </div>
              <div className="stat">
                <p className="stat__label">Stay engaged</p>
                <p className="stat__value">24/7</p>
                <p className="card__body">EventBuddy keeps the vibe alive.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Jump in</p>
                <h2 className="section__title">Quick Actions</h2>
              </div>
            </div>
            <div className="cards-grid cards-grid--three">
              <Link to="/events" className="card">
                <span className="card__eyebrow">Discover</span>
                <h3 className="card__title">Browse Events</h3>
                <p className="card__body">Explore curated gatherings, late-night meetups, and workshops tailored to your interests.</p>
                <div className="card__footer">
                  <span>See what&apos;s next</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
              <Link to="/profile" className="card">
                <span className="card__eyebrow">Identity</span>
                <h3 className="card__title">Craft Your Profile</h3>
                <p className="card__body">Fine-tune interests, expand your circles, and showcase your campus journey.</p>
                <div className="card__footer">
                  <span>Update details</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
              <Link to="/share" className="card">
                <span className="card__eyebrow">Voice</span>
                <h3 className="card__title">Share Experiences</h3>
                <p className="card__body">Drop insights, rate events, and help peers decide what deserves their night.</p>
                <div className="card__footer">
                  <span>Tell your story</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Coming up</p>
                <h2 className="section__title">Featured Events</h2>
              </div>
              <Link to="/events" className="button button--outline">
                View All Events
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <h3 className="card__title">No upcoming events</h3>
                <p className="card__body">Stay tuned—new events drop all the time.</p>
              </div>
            ) : (
              <div className="event-grid">
                {upcomingEvents.map((event) => (
                  <Link key={event.event_id} to={`/events/${event.event_id}`} className="event-card">
                    <div className="badge" aria-hidden="true">
                      <span>📅</span>
                      {formatDate(event.date_and_time)}
                    </div>
                    <h3 className="card__title">{event.title}</h3>
                    <p className="card__body">{event.description}</p>
                    <div className="event-card__meta">
                      <span>
                        <span aria-hidden="true">⏱</span>
                        {formatDateTime(event.date_and_time)}
                      </span>
                      <span>
                        <span aria-hidden="true">📍</span>
                        {event.location || 'TBA'}
                      </span>
                    </div>
                    <div className="event-card__footer">
                      <span>Learn more</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {recentAttendance.length > 0 && (
            <section className="section">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Your trace</p>
                  <h2 className="section__title">Recent Activity</h2>
                </div>
                <Link to="/share" className="button button--ghost">
                  Leave a review
                </Link>
              </div>
              <div className="card">
                <div className="list">
                  {recentAttendance.map((attendance, index) => (
                    <div key={index} className="list-item">
                      <div>
                        <h3 className="list-item__title">{attendance.event?.title || 'Unknown Event'}</h3>
                        <p>{attendance.event?.description}</p>
                      </div>
                      <div>
                        <p className="chip">{formatDateTime(attendance.timestamp_start)}</p>
                        {attendance.rating && (
                          <p className="chip" aria-label={`Rated ${attendance.rating} out of 5`}>
                            ⭐ {attendance.rating}
                          </p>
                        )}
                      </div>
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

export default HomePage;
