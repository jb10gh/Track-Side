/**
 * @typedef {Object} GameEvent
 * @property {string} id - Unique identifier for the event
 * @property {string} type - Event type (goal, penalty, etc.)
 * @property {string} team - Team identifier (us, them)
 * @property {string} label - Event description
 * @property {number} gameTime - Game time in milliseconds
 * @property {number} timestamp - Unix timestamp
 * @property {Object} meta - Additional metadata
 * @property {boolean} [meta.isPK] - Whether goal was a penalty kick
 * @property {string} [meta.playerId] - Player identifier
 */

/**
 * @typedef {Object} Game
 * @property {string} id - Unique game identifier
 * @property {string} opponentName - Opponent team name
 * @property {number} myScore - Our team score
 * @property {number} opponentScore - Opponent score
 * @property {GameEvent[]} events - Array of game events
 * @property {string} status - Game status
 * @property {number} startTime - Game start timestamp
 * @property {number} endTime - Game end timestamp
 */

/**
 * @typedef {Object} GameState
 * @property {Game|null} activeGame - Currently active game
 * @property {Game[]} history - Completed games history
 * @property {string[]} roster - Current squad roster
 */

export {};
