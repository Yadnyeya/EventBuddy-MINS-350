// Event Create Page - Form for hosting a new event
// Maps to: Events > Create Event

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { createEvent } from '../services/eventsApi';

const EVENT_TYPES = ['Event', 'Club Meeting', 'Fair'];

function EventCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    event_type: 'Event'
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const validate = () => {
    if (!form.title.trim()) {
      setStatus({ type: 'error', message: 'Give your event a name before you publish it.' });
      return false;
    }
    if (!form.date) {
      setStatus({ type: 'error', message: 'Choose a date so attendees know when to arrive.' });
      return false;
    }
    if (!form.time) {
      setStatus({ type: 'error', message: 'Set a start time for the gathering.' });
      return false;
    }
    if (!form.event_type) {
      setStatus({ type: 'error', message: 'Select an event type to categorize the experience.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const dateTimeIso = new Date(`${form.date}T${form.time}`)
        .toISOString();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        date_and_time: dateTimeIso,
        event_type: form.event_type
      };

      const created = await createEvent(payload);
      setStatus({ type: 'success', message: 'Event published successfully. Redirecting…' });
      setTimeout(() => {
        navigate(`/events/${created.event_id}`);
      }, 900);
    } catch (error) {
      console.error('Create event error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Unable to create the event. Double-check your details and try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatus = () => {
    if (!status) return null;
    if (status.type === 'success') {
      return <div className="form-success">{status.message}</div>;
    }
    return <div className="form-error">{status.message}</div>;
  };

  return (
    <div>
      <Navigation />
      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Host a new experience</span>
            <h1 className="hero__title">Create an Event</h1>
            <p className="hero__subtitle">
              Craft the details, set the vibe, and invite the community to your next on-campus moment.
            </p>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <form className="card" onSubmit={handleSubmit}>
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Event details</p>
                  <h2 className="section__title">Tell us about the gathering</h2>
                </div>
              </div>

              {renderStatus()}

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="title">Event name</label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Dungeon Hack Night"
                    maxLength={120}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="event_type">Type</label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={form.event_type}
                    onChange={handleChange}
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Share what attendees can expect and any materials to bring."
                  rows={4}
                  maxLength={600}
                />
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Library Room 204"
                    maxLength={120}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="time">Start time</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="card__footer" style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => navigate('/events')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Publishing…' : 'Publish event'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EventCreatePage;
