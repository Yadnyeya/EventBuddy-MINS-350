// Profile Page - View and edit user profile
// Maps to: Profile section (View/Edit Profile, Interests, Event History)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, updateMyProfile, getStudentInterests, addInterest, deleteInterest } from '../services/studentsApi';
import { getMyAttendance } from '../services/attendApi';
import { getCurrentUser } from '../services/supabase';
import Navigation from '../components/Navigation';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInterest, setNewInterest] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

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
  };

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

  const renderStatus = () => {
    if (!status) return null;
    if (status.type === 'success') {
      return <div className="form-success">{status.message}</div>;
    }
    return <div className="form-error">{status.message}</div>;
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
