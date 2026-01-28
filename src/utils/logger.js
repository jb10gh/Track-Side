/**
 * Production-ready logging utility
 * Replaces console.log statements with structured logging
 */

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  info(message, context = {}) {
    if (this.isDevelopment) {
      console.log(message, context);
    }
    // In production, send to monitoring service
    this.sendToMonitoring('info', message, context);
  }

  warn(message, context = {}) {
    if (this.isDevelopment) {
      console.warn(message, context);
    }
    this.sendToMonitoring('warn', message, context);
  }

  error(error, context = {}) {
    console.error(error, context);
    this.sendToMonitoring('error', error, context);
  }

  debug(message, context = {}) {
    if (this.isDevelopment) {
      console.debug(message, context);
    }
  }

  sendToMonitoring(level, message, context) {
    // In production, send to monitoring service like Sentry, LogRocket, etc.
    if (!this.isDevelopment) {
      // Implementation would depend on monitoring service
      // Example: Sentry.captureMessage(message, level);
    }
  }
}

export const logger = new Logger();
