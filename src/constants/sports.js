// Multi-sport configuration system

export const SPORTS = {
  SOCCER: 'soccer',
  BASKETBALL: 'basketball',
  VOLLEYBALL: 'volleyball',
  HOCKEY: 'hockey',
  FOOTBALL: 'football',
  TENNIS: 'tennis'
};

export const SPORT_CONFIGS = {
  [SPORTS.SOCCER]: {
    name: 'Soccer',
    icon: '⚽',
    duration: 90 * 60 * 1000, // 90 minutes
    periods: [
      { name: 'First Half', duration: 45 * 60 * 1000 },
      { name: 'Second Half', duration: 45 * 60 * 1000 }
    ],
    scoreLabels: { home: 'Goals', away: 'Goals' },
    teamSize: 11,
    eventTypes: {
      GOAL: { name: 'Goal', points: 1, icon: '⚽' },
      PENALTY: { name: 'Penalty', points: 1, icon: '🥅', meta: { isPK: true } },
      YELLOW_CARD: { name: 'Yellow Card', points: 0, icon: '🟨' },
      RED_CARD: { name: 'Red Card', points: 0, icon: '🟥' },
      SUBSTITUTION: { name: 'Substitution', points: 0, icon: '🔄' },
      CORNER_KICK: { name: 'Corner Kick', points: 0, icon: '🚩' },
      OFFSIDE: { name: 'Offside', points: 0, icon: '🚫' }
    },
    positions: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    scoringEvents: ['GOAL', 'PENALTY'],
    cardEvents: ['YELLOW_CARD', 'RED_CARD']
  },

  [SPORTS.BASKETBALL]: {
    name: 'Basketball',
    icon: '🏀',
    duration: 48 * 60 * 1000, // 48 minutes (NBA)
    periods: [
      { name: 'Q1', duration: 12 * 60 * 1000 },
      { name: 'Q2', duration: 12 * 60 * 1000 },
      { name: 'Q3', duration: 12 * 60 * 1000 },
      { name: 'Q4', duration: 12 * 60 * 1000 }
    ],
    scoreLabels: { home: 'Points', away: 'Points' },
    teamSize: 5,
    eventTypes: {
      FIELD_GOAL_2: { name: '2-Point Field Goal', points: 2, icon: '🏀' },
      FIELD_GOAL_3: { name: '3-Point Field Goal', points: 3, icon: '🎯' },
      FREE_THROW: { name: 'Free Throw', points: 1, icon: '🎯' },
      REBOUND: { name: 'Rebound', points: 0, icon: '📦' },
      ASSIST: { name: 'Assist', points: 0, icon: '🤝' },
      STEAL: { name: 'Steal', points: 0, icon: '🥷' },
      BLOCK: { name: 'Block', points: 0, icon: '🛡️' },
      TURNOVER: { name: 'Turnover', points: 0, icon: '🔄' },
      FOUL: { name: 'Foul', points: 0, icon: '⚠️' },
      SUBSTITUTION: { name: 'Substitution', points: 0, icon: '🔄' },
      TIMEOUT: { name: 'Timeout', points: 0, icon: '⏸️' }
    },
    positions: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
    scoringEvents: ['FIELD_GOAL_2', 'FIELD_GOAL_3', 'FREE_THROW'],
    cardEvents: []
  },

  [SPORTS.VOLLEYBALL]: {
    name: 'Volleyball',
    icon: '🏐',
    duration: null, // No fixed duration - play to 25 points
    periods: [
      { name: 'Set 1', targetScore: 25 },
      { name: 'Set 2', targetScore: 25 },
      { name: 'Set 3', targetScore: 25 },
      { name: 'Set 4', targetScore: 25 },
      { name: 'Set 5', targetScore: 15 }
    ],
    scoreLabels: { home: 'Points', away: 'Points' },
    teamSize: 6,
    eventTypes: {
      KILL: { name: 'Kill', points: 1, icon: '💥' },
      ACE: { name: 'Ace Serve', points: 1, icon: '🎯' },
      BLOCK: { name: 'Block', points: 1, icon: '🛡️' },
      ASSIST: { name: 'Assist', points: 0, icon: '🤝' },
      DIG: { name: 'Dig', points: 0, icon: '🦺' },
      SERVICE_ERROR: { name: 'Service Error', points: 0, icon: '❌' },
      ATTACK_ERROR: { name: 'Attack Error', points: 0, icon: '❌' },
      ROTATION: { name: 'Rotation', points: 0, icon: '🔄' },
      SUBSTITUTION: { name: 'Substitution', points: 0, icon: '🔄' },
      TIMEOUT: { name: 'Timeout', points: 0, icon: '⏸️' }
    },
    positions: ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Libero'],
    scoringEvents: ['KILL', 'ACE', 'BLOCK'],
    cardEvents: []
  },

  [SPORTS.HOCKEY]: {
    name: 'Hockey',
    icon: '🏒',
    duration: 60 * 60 * 1000, // 60 minutes
    periods: [
      { name: 'Period 1', duration: 20 * 60 * 1000 },
      { name: 'Period 2', duration: 20 * 60 * 1000 },
      { name: 'Period 3', duration: 20 * 60 * 1000 }
    ],
    scoreLabels: { home: 'Goals', away: 'Goals' },
    teamSize: 6,
    eventTypes: {
      GOAL: { name: 'Goal', points: 1, icon: '🏒' },
      ASSIST: { name: 'Assist', points: 0, icon: '🤝' },
      PENALTY_MINOR: { name: 'Minor Penalty', points: 0, icon: '🟨', duration: 2 * 60 * 1000 },
      PENALTY_MAJOR: { name: 'Major Penalty', points: 0, icon: '🟥', duration: 5 * 60 * 1000 },
      PENALTY_MISCONDUCT: { name: 'Misconduct', points: 0, icon: '🟠' },
      SHOT_ON_GOAL: { name: 'Shot on Goal', points: 0, icon: '🎯' },
      SAVE: { name: 'Save', points: 0, icon: '🛡️' },
      HIT: { name: 'Hit', points: 0, icon: '💥' },
      FACEOFF_WIN: { name: 'Faceoff Win', points: 0, icon: '🏆' },
      SUBSTITUTION: { name: 'Line Change', points: 0, icon: '🔄' },
      TIMEOUT: { name: 'Timeout', points: 0, icon: '⏸️' }
    },
    positions: ['Goalie', 'Defenseman', 'Forward', 'Center', 'Winger'],
    scoringEvents: ['GOAL'],
    cardEvents: ['PENALTY_MINOR', 'PENALTY_MAJOR', 'PENALTY_MISCONDUCT']
  },

  [SPORTS.FOOTBALL]: {
    name: 'Football',
    icon: '🏈',
    duration: 60 * 60 * 1000, // 60 minutes
    periods: [
      { name: 'Q1', duration: 15 * 60 * 1000 },
      { name: 'Q2', duration: 15 * 60 * 1000 },
      { name: 'Q3', duration: 15 * 60 * 1000 },
      { name: 'Q4', duration: 15 * 60 * 1000 }
    ],
    scoreLabels: { home: 'Points', away: 'Points' },
    teamSize: 11,
    eventTypes: {
      TOUCHDOWN: { name: 'Touchdown', points: 6, icon: '🏈' },
      FIELD_GOAL: { name: 'Field Goal', points: 3, icon: '🎯' },
      EXTRA_POINT: { name: 'Extra Point', points: 1, icon: '🎯' },
      TWO_POINT_CONVERSION: { name: '2-Point Conversion', points: 2, icon: '🏈' },
      SAFETY: { name: 'Safety', points: 2, icon: '🛡️' },
      INTERCEPTION: { name: 'Interception', points: 0, icon: '🥷' },
      FUMBLE: { name: 'Fumble', points: 0, icon: '🏈' },
      SACK: { name: 'Sack', points: 0, icon: '💥' },
      FIRST_DOWN: { name: 'First Down', points: 0, icon: '📏' },
      PENALTY: { name: 'Penalty', points: 0, icon: '🟨' },
      TIMEOUT: { name: 'Timeout', points: 0, icon: '⏸️' },
      SUBSTITUTION: { name: 'Substitution', points: 0, icon: '🔄' }
    },
    positions: ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety'],
    scoringEvents: ['TOUCHDOWN', 'FIELD_GOAL', 'EXTRA_POINT', 'TWO_POINT_CONVERSION', 'SAFETY'],
    cardEvents: ['PENALTY']
  },

  [SPORTS.TENNIS]: {
    name: 'Tennis',
    icon: '🎾',
    duration: null, // No fixed duration
    periods: [
      { name: 'Set 1', targetScore: 6 },
      { name: 'Set 2', targetScore: 6 },
      { name: 'Set 3', targetScore: 6 }
    ],
    scoreLabels: { home: 'Points', away: 'Points' },
    teamSize: 1,
    eventTypes: {
      ACE: { name: 'Ace', points: 1, icon: '🎯' },
      WINNER: { name: 'Winner', points: 1, icon: '💥' },
      FORCED_ERROR: { name: 'Forced Error', points: 0, icon: '⚠️' },
      UNFORCED_ERROR: { name: 'Unforced Error', points: 0, icon: '❌' },
      DOUBLE_FAULT: { name: 'Double Fault', points: 0, icon: '❌' },
      BREAK_POINT: { name: 'Break Point', points: 1, icon: '🏆' },
      SERVICE_GAME: { name: 'Service Game', points: 0, icon: '🎾' },
      TIMEOUT: { name: 'Timeout', points: 0, icon: '⏸️' }
    },
    positions: ['Server', 'Receiver'],
    scoringEvents: ['ACE', 'WINNER', 'BREAK_POINT'],
    cardEvents: []
  }
};

// Sport-specific validation rules
export const SPORT_VALIDATION_RULES = {
  [SPORTS.BASKETBALL]: {
    maxPlayers: 12,
    minPlayers: 5,
    jerseyNumberRange: { min: 0, max: 99 }
  },
  [SPORTS.VOLLEYBALL]: {
    maxPlayers: 12,
    minPlayers: 6,
    jerseyNumberRange: { min: 1, max: 99 }
  },
  [SPORTS.HOCKEY]: {
    maxPlayers: 20,
    minPlayers: 6,
    jerseyNumberRange: { min: 1, max: 99 }
  },
  [SPORTS.FOOTBALL]: {
    maxPlayers: 53,
    minPlayers: 11,
    jerseyNumberRange: { min: 0, max: 99 }
  }
};

// Helper functions
export const getSportConfig = (sportType) => {
  return SPORT_CONFIGS[sportType] || SPORT_CONFIGS[SPORTS.SOCCER];
};

export const getScoringEvents = (sportType) => {
  const config = getSportConfig(sportType);
  return config.scoringEvents.map(eventType => ({
    type: eventType,
    ...config.eventTypes[eventType]
  }));
};

export const getAllEvents = (sportType) => {
  const config = getSportConfig(sportType);
  return Object.entries(config.eventTypes).map(([type, config]) => ({
    type,
    ...config
  }));
};

export const calculateSportScore = (events, sportType) => {
  const config = getSportConfig(sportType);
  const scoringEvents = events.filter(event => config.scoringEvents.includes(event.type));
  
  return scoringEvents.reduce((total, event) => {
    const eventConfig = config.eventTypes[event.type];
    return total + (eventConfig?.points || 0);
  }, 0);
};

export const validateSportEvent = (event, sportType) => {
  const config = getSportConfig(sportType);
  const eventConfig = config.eventTypes[event.type];
  
  if (!eventConfig) {
    return { valid: false, error: `Event type ${event.type} not valid for ${sportType}` };
  }
  
  // Sport-specific validations
  if (sportType === SPORTS.BASKETBALL && event.type === 'FREE_THROW') {
    if (!event.meta?.made) {
      return { valid: false, error: 'Free throw must specify if made or missed' };
    }
  }
  
  if (sportType === SPORTS.VOLLEYBALL && event.type === 'KILL') {
    if (!event.meta?.player) {
      return { valid: false, error: 'Kill must specify player' };
    }
  }
  
  return { valid: true };
};
