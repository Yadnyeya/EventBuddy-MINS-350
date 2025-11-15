// Utility Functions for EventBuddy

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format time for display
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 8 characters
 */
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color for avatar
 */
export const getAvatarColor = (userId) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  // Generate consistent color based on user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if event is upcoming
 */
export const isUpcoming = (eventDate) => {
  return new Date(eventDate) > new Date();
};

/**
 * Check if event is today
 */
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Get event type badge color
 */
export const getEventTypeBadge = (eventType) => {
  const badges = {
    'study-group': 'bg-blue-100 text-blue-800',
    'social': 'bg-green-100 text-green-800',
    'sports': 'bg-yellow-100 text-yellow-800',
    'club': 'bg-purple-100 text-purple-800',
    'workshop': 'bg-indigo-100 text-indigo-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  return badges[eventType] || badges.other;
};

/**
 * Get personality type emoji
 */
export const getPersonalityEmoji = (personalityType) => {
  const emojis = {
    'introvert': '🤫',
    'extrovert': '🎉',
    'ambivert': '🌟'
  };
  return emojis[personalityType] || '👤';
};

/**
 * Calculate match percentage
 */
export const getMatchPercentage = (matchScore) => {
  // Match score is out of 100
  return Math.min(Math.round(matchScore), 100);
};

/**
 * Format match score for display
 */
export const formatMatchScore = (matchScore) => {
  const percentage = getMatchPercentage(matchScore);
  if (percentage >= 80) return { text: 'Excellent Match', color: 'text-green-600' };
  if (percentage >= 60) return { text: 'Great Match', color: 'text-blue-600' };
  if (percentage >= 40) return { text: 'Good Match', color: 'text-yellow-600' };
  return { text: 'Potential Match', color: 'text-gray-600' };
};

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    return 'Authentication required. Please log in.';
  }
  
  if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

/**
 * Check if users are connected
 */
export const areConnected = (connections, userId1, userId2) => {
  return connections.some(
    conn =>
      conn.status === 'accepted' &&
      ((conn.requester_id === userId1 && conn.receiver_id === userId2) ||
       (conn.requester_id === userId2 && conn.receiver_id === userId1))
  );
};

/**
 * Local storage helpers
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};
