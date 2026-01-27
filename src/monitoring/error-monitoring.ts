/**
 * Production Error Monitoring
 * 
 * Integrates Sentry for error tracking and reporting
 * Provides comprehensive error handling and performance monitoring
 */

// Environment variables
declare const __PROD__: boolean;
declare const __SENTRY_DSN__: string;
declare const __VERSION__: string;

// Lazy load Sentry only in production
let Sentry: any = null;

/**
 * Initialize Sentry error monitoring
 */
export const initializeErrorMonitoring = async () => {
  if (__PROD__ && __SENTRY_DSN__) {
    try {
      // Dynamically import Sentry
      const SentryModule = await import('@sentry/react');
      Sentry = SentryModule;
      
      Sentry.init({
        dsn: __SENTRY_DSN__,
        integrations: [
          new Sentry.BrowserTracing({
            tracingOrigins: ['localhost', 'https://trackside.com', 'https://api.trackside.com'],
          }),
          new Sentry.Replay({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        environment: 'production',
        release: __VERSION__,
        beforeSend: (event: any) => {
          // Filter out certain errors
          if (event.exception) {
            const error = event.exception.values?.[0];
            
            // Filter out network errors that are expected
            if (error?.value?.includes('NetworkError') || error?.value?.includes('fetch')) {
              return null;
            }
            
            // Filter out script errors from browser extensions
            if (error?.stack?.includes('chrome-extension://') || error?.stack?.includes('moz-extension://')) {
              return null;
            }
          }
          
          return event;
        },
      });

      // Set up global error handlers
      setupGlobalErrorHandlers();
      
      console.log('Sentry error monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }
};

/**
 * Set up global error handlers
 */
const setupGlobalErrorHandlers = () => {
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    reportError(new Error(event.message), 'javascript_error', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    reportError(new Error(event.reason), 'unhandled_promise_rejection', {
      promise: event.promise
    });
  });
};

/**
 * Report an error to monitoring service
 */
export const reportError = (error: Error, context?: string, extra?: any) => {
  if (__PROD__ && Sentry) {
    Sentry.withScope((scope: any) => {
      scope.setTag('error_type', 'application_error');
      scope.setTag('component', 'theme_system');
      scope.setTag('version', __VERSION__);
      
      if (context) {
        scope.setTag('context', context);
      }
      
      if (extra) {
        scope.setContext('error_details', extra);
      }
      
      Sentry.captureException(error);
    });
  } else {
    console.error('Error:', error, context, extra);
  }
};

/**
 * Report a theme-specific error
 */
export const reportThemeError = (error: Error, component?: string, details?: any) => {
  reportError(error, `theme_error_${component}`, {
    component,
    theme_details: details,
    user_agent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
};

/**
 * Report a performance issue
 */
export const reportPerformanceIssue = (metric: string, value: number, threshold: number, details?: any) => {
  if (value > threshold) {
    const error = new Error(`Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`);
    reportError(error, 'performance_issue', {
      metric,
      value,
      threshold,
      details
    });
  }
};

/**
 * Report a theme performance issue
 */
export const reportThemePerformanceIssue = (operation: string, duration: number, threshold: number) => {
  reportPerformanceIssue(`theme_${operation}`, duration, threshold, {
    operation,
    duration,
    threshold,
    timestamp: new Date().toISOString()
  });
};

/**
 * Create a user feedback report
 */
export const createUserFeedbackReport = (feedback: string, rating?: number, context?: string) => {
  const error = new Error(`User Feedback: ${feedback}`);
  reportError(error, 'user_feedback', {
    feedback,
    rating,
    context,
    user_agent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, data?: any) => {
  if (__PROD__ && Sentry) {
    Sentry.addBreadcrumb({
      category: 'custom_event',
      message: eventName,
      level: 'info',
      data
    });
  }
};

/**
 * Track user actions
 */
export const trackUserAction = (action: string, component?: string, details?: any) => {
  trackEvent(`user_action_${action}`, {
    component,
    details,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track theme system events
 */
export const trackThemeEvent = (eventName: string, details?: any) => {
  trackEvent(`theme_${eventName}`, {
    ...details,
    timestamp: new Date().toISOString()
  });
};

/**
 * Create a performance transaction
 */
export const createPerformanceTransaction = (name: string, operation: string) => {
  if (__PROD__ && Sentry) {
    const transaction = Sentry.startTransaction({
      name,
      operation,
      tags: {
        component: 'theme_system'
      }
    });

    return transaction;
  }
  
  return null;
};

/**
 * Set user context for error reporting
 */
export const setUserContext = (user: { id?: string; email?: string; username?: string }) => {
  if (__PROD__ && Sentry) {
    Sentry.setUser(user);
  }
};

/**
 * Clear user context
 */
export const clearUserContext = () => {
  if (__PROD__ && Sentry) {
    Sentry.setUser(null);
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, category: string = 'debug', level: 'info' | 'warning' | 'error' = 'info', data?: any) => {
  if (__PROD__ && Sentry) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data
    });
  }
};

/**
 * Check if error monitoring is available
 */
export const isErrorMonitoringAvailable = () => {
  return __PROD__ && Sentry !== null;
};

/**
 * Get Sentry client for advanced usage
 */
export const getSentryClient = () => {
  if (__PROD__ && Sentry) {
    return Sentry;
  }
  return null;
};

/**
 * Health check for error monitoring
 */
export const errorMonitoringHealthCheck = () => {
  return {
    initialized: isErrorMonitoringAvailable(),
    dsn: __SENTRY_DSN__ ? 'configured' : 'not_configured',
    environment: __PROD__ ? 'production' : 'development',
    version: __VERSION__ || 'unknown'
  };
};

// Auto-initialize in production
if (__PROD__) {
  initializeErrorMonitoring();
}
