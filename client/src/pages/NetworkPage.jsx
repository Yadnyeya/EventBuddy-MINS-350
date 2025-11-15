// Network Page - Discover groups and expand connections
// Maps to: Build Network section (Find Groups, Join Groups)

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import { getAllEvents } from '../services/eventsApi';
import { getAllStudents, searchByInterest } from '../services/studentsApi';
import { checkInToEvent } from '../services/attendApi';

const INTEREST_FILTERS = [
  'All',
  'Tech & Makers',
  'Arts & Media',
  'Health & Wellness',
  'Service & Leadership'
];

function inferCluster(event) {
  const reference = (event.category || event.event_type || '').toLowerCase();
  const title = event.title?.toLowerCase() ?? '';

  if (reference.includes('code') || reference.includes('tech') || title.includes('hack')) {
    return 'Tech & Makers';
  }
  if (reference.includes('art') || reference.includes('film') || reference.includes('music')) {
    return 'Arts & Media';
  }
  if (reference.includes('well') || reference.includes('health') || reference.includes('fit')) {
    return 'Health & Wellness';
  }
  if (reference.includes('service') || reference.includes('lead') || reference.includes('volunteer')) {
    return 'Service & Leadership';
  }
  return 'All';
}

function NetworkPage() {
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [interestResults, setInterestResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(null);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await getAllEvents({ event_type: 'Club Meeting', limit: 30 });
        const enhanced = (data.events || []).map((event) => ({
          ...event,
          cluster: inferCluster(event)
        }));
        setGroups(enhanced);
      } catch (error) {
        console.error('Error loading groups:', error);
        setGroups([
          {
            event_id: 'mock-1',
            title: 'Dungeon Masters Guild',
            description: 'Weekly tabletop campaigns and quest-building sessions.',
            location: 'Student Union 214',
            date_and_time: '2025-11-21T19:00:00Z',
            cluster: 'Tech & Makers'
          },
          {
            event_id: 'mock-2',
            title: 'Campus Creators Collective',
            description: 'Content creation collab night for film, music, and design students.',
            location: 'Media Lab Studio',
            date_and_time: '2025-11-19T18:00:00Z',
            cluster: 'Arts & Media'
          },
          {
            event_id: 'mock-3',
            title: 'Trailblazers Hiking Crew',
            description: 'Weekend adventures, wellness tips, and nature photography.',
            location: 'Meet at North Quad',
            date_and_time: '2025-11-23T09:00:00Z',
            cluster: 'Health & Wellness'
          }
        ]);
      } finally {
        setLoadingGroups(false);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getAllStudents(12, 0);
        setMembers(data.students || data || []);
      } catch (error) {
        console.error('Error loading members:', error);
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesFilter = activeFilter === 'All' || group.cluster === activeFilter;
      const matchesSearch = group.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [groups, activeFilter, searchTerm]);

  const handleJoin = async (eventId) => {
    setJoiningId(eventId);
    setStatus(null);
    try {
      await checkInToEvent(eventId, []);
      setStatus({ type: 'success', message: 'Join request confirmed. Check your dashboard for details.' });
    } catch (error) {
      console.error('Join group error:', error);
      setStatus({ type: 'error', message: error.message || 'Unable to join right now. Try again shortly.' });
    } finally {
      setJoiningId(null);
    }
  };

  const handleInterestSearch = async (interest) => {
    setStatus(null);
    try {
      const results = await searchByInterest(interest, 8);
      setInterestResults(results.students || results || []);
    } catch (error) {
      console.error('Interest search error:', error);
      setInterestResults([]);
      setStatus({ type: 'error', message: 'No matches found for that interest just yet.' });
    }
  };

  const renderStatus = () => {
    if (!status) return null;
    if (status.type === 'success') {
      return <div className="form-success" style={{ marginBottom: '1.5rem' }}>{status.message}</div>;
    }
    return <div className="form-error" style={{ marginBottom: '1.5rem' }}>{status.message}</div>;
  };

  return (
    <div>
      <Navigation />
      <main className="page">
        <section className="hero">
          <div className="container hero__content">
            <span className="hero__eyebrow">Build your crew</span>
            <h1 className="hero__title">Find groups and build your network</h1>
            <p className="hero__subtitle">
              Explore campus collectives tailored to your interests, join meet-ups, and connect with students who share your energy.
            </p>
          </div>
        </section>

        <div className="container">
          <section className="section">
            <div className="section__header">
              <div>
                <p className="section__subtitle">Find your circle</p>
                <h2 className="section__title">Explore groups</h2>
              </div>
              <input
                type="search"
                className="search-input"
                placeholder="Search groups by name or vibe…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search groups"
              />
            </div>

            <div className="pill-group" style={{ marginBottom: '1.5rem' }}>
              {INTEREST_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`pill-toggle ${activeFilter === filter ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {renderStatus()}

            {loadingGroups ? (
              <div className="empty-state">
                <h3 className="card__title">Curating groups…</h3>
                <p className="card__body">Give us a moment while we surface the right communities.</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="empty-state">
                <h3 className="card__title">No groups match those filters</h3>
                <p className="card__body">Try a different interest or clear the search to browse everything.</p>
              </div>
            ) : (
              <div className="event-grid">
                {filteredGroups.map((group) => (
                  <div key={group.event_id || group.id} className="event-card">
                    <div className="badge">
                      <span aria-hidden="true">👥</span>
                      {group.cluster}
                    </div>
                    <h3 className="card__title">{group.title}</h3>
                    <p className="card__body">{group.description}</p>
                    <div className="event-card__meta">
                      {group.location && (
                        <span>
                          <span aria-hidden="true">📍</span>
                          {group.location}
                        </span>
                      )}
                      {group.date_and_time && (
                        <span>
                          <span aria-hidden="true">🕓</span>
                          {new Date(group.date_and_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="event-card__footer">
                      <span>Meet the squad</span>
                      <button
                        type="button"
                        className="button button--primary"
                        style={{ padding: '0.5rem 1.2rem' }}
                        onClick={() => handleJoin(group.event_id || group.id)}
                        disabled={joiningId === (group.event_id || group.id)}
                      >
                        {joiningId === (group.event_id || group.id) ? 'Joining…' : 'Join group'}
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
                <p className="section__subtitle">Browse members</p>
                <h2 className="section__title">Active networkers</h2>
              </div>
              <div className="pill-group" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                {['Basketball', 'Photography', 'Coding', 'Volunteering'].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className="pill-toggle"
                    onClick={() => handleInterestSearch(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {loadingMembers ? (
              <div className="empty-state">
                <h3 className="card__title">Scanning the network…</h3>
                <p className="card__body">We&apos;re pulling community members and buddy leads.</p>
              </div>
            ) : (
              <div className="cards-grid cards-grid--three">
                {(interestResults.length > 0 ? interestResults : members).map((member) => (
                  <div key={member.id || member.student_id} className="card">
                    <span className="card__eyebrow">{member.personality_type || 'Explorer'}</span>
                    <h3 className="card__title">{member.full_name || member.username || member.email?.split('@')[0]}</h3>
                    <p className="card__body">
                      {member.bio || 'Ready to collaborate, meet new people, and build unforgettable campus stories.'}
                    </p>
                    <div className="chip-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(member.interests || member.top_interests || [])
                        .slice(0, 3)
                        .map((interest, index) => (
                          <span key={`${member.id || member.student_id}-${index}`} className="chip">
                            {interest.name || interest.interest_name || interest}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default NetworkPage;
