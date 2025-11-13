import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upsertProfile, addInterest } from '../services/studentsApi';
import { getCurrentUser } from '../services/supabase';

const YEAR_OPTIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const COMMON_INTERESTS = [
  'Basketball', 'Soccer', 'Volleyball', 'Tennis', 'Swimming',
  'Coding', 'Web Development', 'Data Science', 'AI/ML', 'Cybersecurity',
  'Music', 'Guitar', 'Piano', 'Singing', 'DJing',
  'Photography', 'Videography', 'Art', 'Drawing', 'Painting',
  'Reading', 'Writing', 'Poetry', 'Blogging',
  'Hiking', 'Camping', 'Rock Climbing', 'Running', 'Cycling',
  'Gaming', 'Board Games', 'Chess', 'Esports',
  'Cooking', 'Baking', 'Food', 'Coffee',
  'Volunteering', 'Community Service', 'Tutoring',
  'Entrepreneurship', 'Startups', 'Business', 'Finance',
  'Theater', 'Drama', 'Dance', 'Film',
  'Travel', 'Languages', 'Culture', 'International Affairs'
];

const STEPS = ['Year', 'Interests', 'Review'];
const MAX_INTERESTS = 10;

function ProfileSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ email: '', year: '', is_verified: false });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setFormData((prev) => ({ ...prev, email: user.email }));
        }
      })
      .catch((error) => {
        console.error('Error getting user:', error);
        setStatus({ type: 'error', message: 'Unable to fetch your account details.' });
      });
  }, []);

  const clearStatus = () => setStatus(null);

  const handleYearSelect = (year) => {
    setFormData((prev) => ({ ...prev, year }));
    clearStatus();
  };

  const handleInterestToggle = (interest) => {
    clearStatus();
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
      return;
    }
    if (selectedInterests.length >= MAX_INTERESTS) {
      setStatus({ type: 'error', message: `Pick up to ${MAX_INTERESTS} interests.` });
      return;
    }
    setSelectedInterests((prev) => [...prev, interest]);
  };

  const handleAddCustomInterest = (event) => {
    event.preventDefault();
    clearStatus();
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (selectedInterests.includes(trimmed)) {
      setStatus({ type: 'error', message: 'That interest is already on your list.' });
      return;
    }
    if (selectedInterests.length >= MAX_INTERESTS) {
      setStatus({ type: 'error', message: `Pick up to ${MAX_INTERESTS} interests.` });
      return;
    }
    setSelectedInterests((prev) => [...prev, trimmed]);
    setCustomInterest('');
  };

  const handleNext = () => {
    clearStatus();
    if (step === 0 && !formData.year) {
      setStatus({ type: 'error', message: 'Select your class year before moving on.' });
      return;
    }
    if (step === 1 && selectedInterests.length === 0) {
      setStatus({ type: 'error', message: 'Choose at least one interest so we can tailor events.' });
      return;
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    clearStatus();
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    clearStatus();
    setLoading(true);
    try {
      await upsertProfile({
        email: formData.email,
        year: formData.year,
        is_verified: true
      });

      for (const interest of selectedInterests) {
        try {
          await addInterest(interest);
        } catch (error) {
          console.error('Error adding interest:', error);
        }
      }

      setStatus({ type: 'success', message: 'Profile saved! Redirecting you to the dashboard…' });
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      console.error('Profile setup error:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to create profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (!status) return null;
    if (status.type === 'success') {
      return <div className="form-success">{status.message}</div>;
    }
    return <div className="form-error">{status.message}</div>;
  };

  const progressWidth = ((step + 1) / STEPS.length) * 100;

  const renderYearStep = () => (
    <div className="cards-grid cards-grid--two">
      {YEAR_OPTIONS.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => handleYearSelect(year)}
          className={`pill-toggle ${formData.year === year ? 'is-active' : ''}`}
        >
          {year}
        </button>
      ))}
    </div>
  );

  const renderInterestsStep = () => (
    <>
      <div className="interest-cloud">
        {selectedInterests.length === 0 ? (
          <p className="card__body">No interests yet — start adding a few to shape your feed.</p>
        ) : (
          selectedInterests.map((interest) => (
            <span key={interest} className="interest-chip">
              {interest}
              <button type="button" aria-label={`Remove ${interest}`} onClick={() => handleInterestToggle(interest)}>
                ×
              </button>
            </span>
          ))
        )}
      </div>

      <form className="form" onSubmit={handleAddCustomInterest}>
        <div className="form-field">
          <label htmlFor="custom-interest">Add custom interest</label>
          <input
            id="custom-interest"
            value={customInterest}
            onChange={(event) => setCustomInterest(event.target.value)}
            placeholder="Add something unique…"
            maxLength={80}
          />
        </div>
        <button type="submit" className="button button--outline">
          Add to list
        </button>
      </form>

      <div className="pill-group">
        {COMMON_INTERESTS.map((interest) => (
          <button
            key={interest}
            type="button"
            className={`pill-toggle ${selectedInterests.includes(interest) ? 'is-active' : ''}`}
            onClick={() => handleInterestToggle(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </>
  );

  const renderReviewStep = () => (
    <div className="timeline">
      <div className="timeline-item">
        <div className="timeline-item__header">
          <h3 className="timeline-item__title">Email</h3>
        </div>
        <p className="card__body">{formData.email}</p>
      </div>
      <div className="timeline-item">
        <div className="timeline-item__header">
          <h3 className="timeline-item__title">Class year</h3>
        </div>
        <p className="card__body">{formData.year || 'Not selected'}</p>
      </div>
      <div className="timeline-item">
        <div className="timeline-item__header">
          <h3 className="timeline-item__title">Interests ({selectedInterests.length})</h3>
        </div>
        {selectedInterests.length === 0 ? (
          <p className="card__body">Add at least one interest to tailor recommendations.</p>
        ) : (
          <div className="interest-cloud">
            {selectedInterests.map((interest) => (
              <span key={interest} className="chip">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (step === 0) return renderYearStep();
    if (step === 1) return renderInterestsStep();
    return renderReviewStep();
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="container hero__content">
          <span className="hero__eyebrow">First-time setup</span>
          <h1 className="hero__title">Complete your profile</h1>
          <p className="hero__subtitle">Share a bit about yourself so EventBuddy can surface the right events and connections.</p>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="card">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Step {step + 1} of {STEPS.length}</p>
                <h2 className="section__title">{STEPS[step]}</h2>
              </div>
            </div>

            <div className="progress-track">
              <div className="progress-track__bar" style={{ width: `${progressWidth}%` }} />
            </div>

            <div className="steps">
              {STEPS.map((label, index) => (
                <div key={label} className={`steps__item ${index === step ? 'is-active' : ''}`}>
                  {label}
                </div>
              ))}
            </div>

            {renderStatus()}

            <div className="section" style={{ marginTop: '2rem' }}>
              {renderStepContent()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2.5rem' }}>
              <button
                type="button"
                className="button button--ghost"
                onClick={handleBack}
                disabled={step === 0 || loading}
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" className="button button--primary" onClick={handleNext}>
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Finish setup'}
                </button>
              )}
            </div>
          </div>

          <div className="auth__footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="button button--ghost" onClick={() => navigate('/')}
              style={{ width: '100%' }}
            >
              Skip for now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfileSetupPage;
