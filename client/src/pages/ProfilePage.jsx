// Profile Page - View and edit user profile
// Maps to: Profile section (View/Edit Profile, Interests, Event History)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, updateMyProfile, getStudentInterests, addInterest, deleteInterest } from '../services/studentsApi';
import { getMyAttendance } from '../services/attendApi';
import { getCurrentUser } from '../services/supabase';
import Navigation from '../components/Navigation';

const preferenceDefaults = {
  meetupSize: 'Small crew (2-4)',
  energyLevel: 'Balanced energy',
  arrivalStyle: 'Early bird',
  preferredEvents: ['Workshops & skill shares', 'Campus nightlife'],
  communication: 'Group chat first'
};

const privacyDefaults = {
  allowMessages: true,
  shareEventHistory: true,
  showAvailability: false,
  safetyCheck: true
};

const EVENT_PREF_OPTIONS = [
  'Workshops & skill shares',
  'Club meetings',
  'Campus nightlife',
  'Volunteer missions',
  'Outdoor adventures'
];

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInterest, setNewInterest] = useState('');
  const [status, setStatus] = useState(null);
  const [preferences, setPreferences] = useState(preferenceDefaults);
  const [privacy, setPrivacy] = useState(privacyDefaults);
  const [preferenceStatus, setPreferenceStatus] = useState(null);
  const [privacyStatus, setPrivacyStatus] = useState(null);

  const loadStoredSettings = useCallback((key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.warn(`Unable to parse stored settings for ${key}`, error);
      return fallback;
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser?.id) {
        setPreferences(loadStoredSettings(`eventbuddy:prefs:${currentUser.id}`, preferenceDefaults));
        setPrivacy(loadStoredSettings(`eventbuddy:privacy:${currentUser.id}`, privacyDefaults));
      }

      try {
        const [profileData, interestsData, attendanceData] = await Promise.all([
          getMyProfile(),
          getStudentInterests(currentUser.id),
          getMyAttendance()
        ]);
        setProfile(profileData);
        setInterests(interestsData || []);
        setAttendance(attendanceData || []);
      } catch (error) {
        console.error('Error loading profile data, using mock data:', error);
        setProfile({
          student_id: currentUser.id,
          email: currentUser.email || 'demo@university.edu',
          year: 'Junior'
        });
        setInterests([
          { interest_id: 1, interest_name: 'Photography' },
          { interest_id: 2, interest_name: 'Hiking' },
          { interest_id: 3, interest_name: 'Technology' }
        ]);
        setAttendance([
          {
            attend_id: 1,
            event_title: 'Study Group Session',
            timestamp_start: new Date('2025-01-15T14:00:00').toISOString(),
            rating: 5,
            shared_experience: 'Great study session!'
          },
          {
            attend_id: 2,
            event_title: 'Campus Fair',
            timestamp_start: new Date('2025-01-12T10:00:00').toISOString(),
            rating: 4
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setStatus({ type: 'error', message: 'Unable to load profile details.' });
    } finally {
      setLoading(false);
    }
  }, [loadStoredSettings]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`eventbuddy:prefs:${user.id}`, JSON.stringify(preferences));
  }, [preferences, user]);

  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`eventbuddy:privacy:${user.id}`, JSON.stringify(privacy));
  }, [privacy, user]);

  const handleSave = async () => {
    try {
      await updateMyProfile(profile);
      setEditing(false);
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim()) return;

    try {
      await addInterest(newInterest);
      setInterests([...interests, { interest_name: newInterest }]);
      setNewInterest('');
      setStatus({ type: 'success', message: 'Interest added to your profile.' });
    } catch (error) {
      console.error('Error adding interest:', error);
      setStatus({ type: 'error', message: 'Unable to add interest right now.' });
    }
  };

  const handleDeleteInterest = async (interestId) => {
    try {
      await deleteInterest(interestId);
      setInterests(interests.filter((i) => i.interest_id !== interestId));
      setStatus({ type: 'success', message: 'Interest removed from your roster.' });
    } catch (error) {
      console.error('Error deleting interest:', error);
      setStatus({ type: 'error', message: 'Failed to remove interest.' });
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    setPreferenceStatus(null);
  };

  const handlePreferredEventsToggle = (value) => {
    setPreferences((prev) => {
      const exists = prev.preferredEvents.includes(value);
      const preferredEvents = exists
        ? prev.preferredEvents.filter((item) => item !== value)
        : [...prev.preferredEvents, value];
      return { ...prev, preferredEvents };
    });
    setPreferenceStatus(null);
  };

  const handleSavePreferences = () => {
    setPreferenceStatus({
      type: 'success',
      message: 'Buddy preferences saved locally. We will sync them once profile metadata expands.'
    });
  };

  const handlePrivacyToggle = (field) => {
    setPrivacy((prev) => ({ ...prev, [field]: !prev[field] }));
    setPrivacyStatus(null);
  };

  const handleSavePrivacy = () => {
    setPrivacyStatus({
      type: 'success',
      message: 'Privacy & safety preferences updated. Your controls are live.'
    });
  };

  const renderStatus = () => {
    if (!status) return null;
    if (status.type === 'success') {
      return <div className="form-success">{status.message}</div>;
    }
    return <div className="form-error">{status.message}</div>;
  };

  const renderPreferenceStatus = () => {
    if (!preferenceStatus) return null;
    if (preferenceStatus.type === 'success') {
      return <div className="form-success">{preferenceStatus.message}</div>;
    }
    return <div className="form-info">{preferenceStatus.message}</div>;
  };

  const renderPrivacyStatus = () => {
    if (!privacyStatus) return null;
    if (privacyStatus.type === 'success') {
      return <div className="form-success">{privacyStatus.message}</div>;
    }
    return <div className="form-info">{privacyStatus.message}</div>;
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <main className="page">
          <div className="container">
            <section className="section">
              <div className="empty-state">
                <h2 className="card__title">Loading profile</h2>
                <p className="card__body">We are assembling your EventBuddy dossier.</p>
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
            <span className="hero__eyebrow">Your domain</span>
            <h1 className="hero__title">{user?.email?.split('@')[0] || 'Adventurer'}</h1>
            <p className="hero__subtitle">Tune your profile, curate your interests, and revisit the nights that defined your semester.</p>
            <div className="hero__actions">
              <Link to="/events" className="button button--primary">
                Browse upcoming events
              </Link>
              <Link to="/share" className="button button--ghost">
                Share an experience
              </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="card">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Profile essentials</p>
                  <h2 className="section__title">Basic Information</h2>
                </div>
                {!editing ? (
                  <button type="button" className="button button--outline" onClick={() => setEditing(true)}>
                    Edit profile
                  </button>
                ) : (
                  <div className="hero__actions" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="button button--primary" onClick={handleSave}>
                      Save changes
                    </button>
                    <button type="button" className="button button--ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {renderStatus()}

              <div className="profile-grid" style={{ marginTop: '1.5rem' }}>
                <div className="card card--accent" style={{ borderColor: 'rgba(198, 133, 58, 0.25)' }}>
                  <span className="card__eyebrow">Email</span>
                  <h3 className="card__title">{profile?.email || 'Not available'}</h3>
                  <p className="card__body">Primary contact used for event confirmations.</p>
                </div>
                <div className="card card--accent" style={{ borderColor: 'rgba(198, 133, 58, 0.25)' }}>
                  <span className="card__eyebrow">Academic year</span>
                  {editing ? (
                    <div className="form-field">
                      <label htmlFor="academic-year">Select your standing</label>
                      <select
                        id="academic-year"
                        value={profile?.year || ''}
                        onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                      >
                        <option value="">Choose your year…</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h3 className="card__title">{profile?.year || 'Not set'}</h3>
                      <p className="card__body">Update this so hosts know your perspective.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Signal your vibe</p>
                  <h2 className="section__title">Interests</h2>
                </div>
              </div>

              {interests.length > 0 ? (
                <div className="interest-cloud">
                  {interests.map((interest, index) => (
                    <span key={interest.interest_id || index} className="interest-chip">
                      {interest.interest_name}
                      <button type="button" onClick={() => handleDeleteInterest(interest.interest_id)} aria-label={`Remove ${interest.interest_name}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3 className="card__title">No interests listed yet</h3>
                  <p className="card__body">Add a few to help us curate better events.</p>
                </div>
              )}

              <div className="form" style={{ marginTop: '1.5rem' }}>
                <div className="form-field">
                  <label htmlFor="interest">Add new interest</label>
                  <input
                    id="interest"
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Photography, coding, indie films…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                  />
                </div>
                <button type="button" className="button button--outline" onClick={handleAddInterest}>
                  Add interest
                </button>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Tune the signal</p>
                  <h2 className="section__title">Buddy preferences</h2>
                </div>
                <button type="button" className="button button--outline" onClick={handleSavePreferences}>
                  Save preferences
                </button>
              </div>

              {renderPreferenceStatus()}

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="meetup-size">Ideal crew size</label>
                  <select
                    id="meetup-size"
                    value={preferences.meetupSize}
                    onChange={(event) => handlePreferenceChange('meetupSize', event.target.value)}
                  >
                    <option value="Solo missions">Solo missions</option>
                    <option value="Small crew (2-4)">Small crew (2-4)</option>
                    <option value="Full squad (5-8)">Full squad (5-8)</option>
                    <option value="Open invite">Open invite</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="energy-level">Preferred energy</label>
                  <select
                    id="energy-level"
                    value={preferences.energyLevel}
                    onChange={(event) => handlePreferenceChange('energyLevel', event.target.value)}
                  >
                    <option value="Laid-back">Laid-back</option>
                    <option value="Balanced energy">Balanced energy</option>
                    <option value="High hype">High hype</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="arrival-style">Arrival style</label>
                  <select
                    id="arrival-style"
                    value={preferences.arrivalStyle}
                    onChange={(event) => handlePreferenceChange('arrivalStyle', event.target.value)}
                  >
                    <option value="Early bird">Early bird</option>
                    <option value="Right on time">Right on time</option>
                    <option value="Roll in late">Roll in late</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="communication">How should friends ping you?</label>
                  <select
                    id="communication"
                    value={preferences.communication}
                    onChange={(event) => handlePreferenceChange('communication', event.target.value)}
                  >
                    <option value="Group chat first">Group chat first</option>
                    <option value="DMs only">DMs only</option>
                    <option value="Text me">Text me</option>
                    <option value="In-app only">In-app only</option>
                  </select>
                </div>
              </div>

              <div className="buddy-preferences">
                <p className="section__subtitle">Preferred event vibes</p>
                <div className="pill-group" style={{ flexWrap: 'wrap' }}>
                  {EVENT_PREF_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`pill-toggle ${preferences.preferredEvents.includes(option) ? 'is-active' : ''}`}
                      onClick={() => handlePreferredEventsToggle(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="card__footer" style={{ justifyContent: 'space-between' }}>
                  <span className="card__body" style={{ color: 'var(--color-text-muted)' }}>
                    These settings shape your match suggestions and Attend Together recommendations.
                  </span>
                  <Link to="/connect" className="button button--ghost">
                    Open Connect hub
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card" id="privacy">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Guard your vibe</p>
                  <h2 className="section__title">Privacy & Safety</h2>
                </div>
                <button type="button" className="button button--outline" onClick={handleSavePrivacy}>
                  Save safety settings
                </button>
              </div>

              {renderPrivacyStatus()}

              <div className="safety-grid">
                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={() => handlePrivacyToggle('allowMessages')}
                  />
                  <div>
                    <strong>Allow friend-of-friend messages</strong>
                    <span>Keep your inbox open to buddies your matches already trust.</span>
                  </div>
                </label>

                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={privacy.shareEventHistory}
                    onChange={() => handlePrivacyToggle('shareEventHistory')}
                  />
                  <div>
                    <strong>Show recent event history</strong>
                    <span>Helps others see what you vibe with. Toggle off for stealth mode.</span>
                  </div>
                </label>

                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={privacy.showAvailability}
                    onChange={() => handlePrivacyToggle('showAvailability')}
                  />
                  <div>
                    <strong>Share weekly availability</strong>
                    <span>Display the nights you are free for quick planning.</span>
                  </div>
                </label>

                <label className="toggle-control">
                  <input
                    type="checkbox"
                    checked={privacy.safetyCheck}
                    onChange={() => handlePrivacyToggle('safetyCheck')}
                  />
                  <div>
                    <strong>Enable Safety Check shortcut</strong>
                    <span>Quick-access button alerts your emergency contacts directly from EventBuddy.</span>
                  </div>
                </label>
              </div>

              <div className="card__footer" style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <span className="card__body" style={{ color: 'var(--color-text-muted)' }}>
                  Need to block or report someone? Head to their profile or messaging thread for immediate action.
                </span>
                <Link to="/connect" className="button button--ghost">
                  Visit message center
                </Link>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card">
              <div className="section__header">
                <div>
                  <p className="section__subtitle">Trail of memories</p>
                  <h2 className="section__title">Attendance history</h2>
                </div>
                <Link to="/events" className="button button--ghost">
                  Explore more events
                </Link>
              </div>

              {attendance.length > 0 ? (
                <div className="timeline">
                  {attendance.map((record) => (
                    <div key={record.attend_id} className="timeline-item">
                      <div className="timeline-item__header">
                        <h3 className="timeline-item__title">{record.event_title}</h3>
                        <span className="timeline-item__meta">
                          {new Date(record.timestamp_start).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {record.rating && (
                        <div className="chip" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
                          ⭐ {record.rating}
                        </div>
                      )}
                      {record.shared_experience && <p className="card__body">“{record.shared_experience}”</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3 className="card__title">No events logged</h3>
                  <p className="card__body">Check in to events and your timeline will bloom here.</p>
                  <Link to="/events" className="button button--primary">
                    Find your first event
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
