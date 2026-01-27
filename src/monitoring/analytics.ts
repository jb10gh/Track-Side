/**
 * Production Analytics and Performance Monitoring
 * 
 * Integrates Google Analytics and performance monitoring for production
 * Tracks Core Web Vitals, theme performance, and user interactions
 */

// Type declarations for Google Analytics
declare global {
  interface Window {
    gtag: (command: string, action: string, options?: any) => void;
    dataLayer: any[];
  }
}

// Environment variables
declare const __PROD__: boolean;
declare const __ANALYTICS_ID__: string;
declare const __VERSION__: string;

/**
 * Initialize Google Analytics for production
 */
export const initializeAnalytics = () => {
  if (__PROD__ && __ANALYTICS_ID__) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${__ANALYTICS_ID__}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', __ANALYTICS_ID__, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        dimension1: 'theme_version',
        dimension2: 'user_agent',
        metric1: 'theme_init_time',
        metric2: 'style_generation_time'
      }
    });

    // Track initial page load
    trackPageView();

    // Start performance monitoring
    trackPerformanceMetrics();

    // Track theme system performance
    trackThemePerformance();

    console.log('Analytics initialized for production');
  }
};

/**
 * Track page views
 */
export const trackPageView = (path?: string) => {
  if (__PROD__ && window.gtag) {
    window.gtag('config', __ANALYTICS_ID__, {
      page_path: path || window.location.pathname,
      page_title: document.title
    });
  }
};

/**
 * Track user interactions
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (__PROD__ && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

/**
 * Track theme-related events
 */
export const trackThemeEvent = (action: string, details?: any) => {
  trackEvent(action, 'theme_system', details?.component, details?.value);
};

/**
 * Track Core Web Vitals
 */
export const trackPerformanceMetrics = () => {
  if (!('performance' in window)) return;

  // Track Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        const lcp = Math.round(entry.startTime);
        
        window.gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: lcp,
          event_label: entry.id,
          custom_map: { metric1: 'LCP' }
        });

        // Report performance issues
        if (lcp > 2500) {
          trackEvent('LCP_SLOW', 'performance', entry.id, lcp);
        }
      }
    });
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'first-input') {
        const fid = Math.round(entry.processingStart - entry.startTime);
        
        window.gtag('event', 'FID', {
          event_category: 'Web Vitals',
          value: fid,
          event_label: entry.id,
          custom_map: { metric2: 'FID' }
        });

        // Report performance issues
        if (fid > 100) {
          trackEvent('FID_SLOW', 'performance', entry.id, fid);
        }
      }
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Track Cumulative Layout Shift (CLS)
  const clsObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'layout-shift') {
        const cls = Math.round(entry.value * 1000);
        
        window.gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: cls,
          event_label: entry.id,
          custom_map: { metric3: 'CLS' }
        });

        // Report performance issues
        if (cls > 100) {
          trackEvent('CLS_HIGH', 'performance', entry.id, cls);
        }
      }
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Track First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        const fcp = Math.round(entry.startTime);
        
        window.gtag('event', 'FCP', {
          event_category: 'Web Vitals',
          value: fcp,
          event_label: 'FCP'
        });

        // Report performance issues
        if (fcp > 1800) {
          trackEvent('FCP_SLOW', 'performance', 'FCP', fcp);
        }
      }
    });
  });
  fcpObserver.observe({ entryTypes: ['paint'] });
};

/**
 * Track theme system performance
 */
export const trackThemePerformance = () => {
  // Track theme initialization time
  const themeInitStart = performance.now();
  
  // Use a timeout to measure when theme is ready
  setTimeout(() => {
    const themeInitTime = Math.round(performance.now() - themeInitStart);
    
    window.gtag('event', 'theme_init_time', {
      event_category: 'theme_performance',
      value: themeInitTime,
      custom_map: { metric1: 'theme_init_time' }
    });

    // Report performance issues
    if (themeInitTime > 50) {
      trackEvent('THEME_INIT_SLOW', 'performance', 'theme_initialization', themeInitTime);
    }
  }, 0);

  // Track style generation performance
  let styleGenerationCount = 0;
  let styleGenerationTotal = 0;
  
  // Override style generation to track performance
  const originalStyleCache = new Map();
  
  // Monitor style cache performance
  setInterval(() => {
    if (styleGenerationCount > 0) {
      const avgStyleTime = Math.round(styleGenerationTotal / styleGenerationCount);
      
      window.gtag('event', 'style_generation_time', {
        event_category: 'theme_performance',
        value: avgStyleTime,
        custom_map: { metric2: 'style_generation_time' }
      });

      // Reset counters
      styleGenerationCount = 0;
      styleGenerationTotal = 0;
    }
  }, 10000); // Every 10 seconds
};

/**
 * Track user interactions with theme components
 */
export const trackComponentInteraction = (componentName: string, action: string, value?: number) => {
  trackEvent(action, 'component_interaction', componentName, value);
};

/**
 * Track theme-related errors
 */
export const trackThemeError = (error: Error, context?: string) => {
  trackEvent('theme_error', 'error', context, 1);
  
  // Send to error monitoring service
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false
    });
  }
};

/**
 * Track bundle performance
 */
export const trackBundlePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Track resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // Track theme-specific resources
          if (resource.name.includes('theme')) {
            trackEvent('theme_resource_load', 'performance', resource.name, Math.round(resource.duration));
          }
          
          // Track slow resources
          if (resource.duration > 1000) {
            trackEvent('slow_resource', 'performance', resource.name, Math.round(resource.duration));
          }
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};

/**
 * Track user experience metrics
 */
export const trackUserExperience = () => {
  // Track time to interactive
  const ttiObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name === 'time-to-interactive') {
        const tti = Math.round(entry.startTime);
        
        window.gtag('event', 'TTI', {
          event_category: 'user_experience',
          value: tti
        });

        // Report performance issues
        if (tti > 3000) {
          trackEvent('TTI_SLOW', 'performance', 'time_to_interactive', tti);
        }
      }
    });
  });
  ttiObserver.observe({ entryTypes: ['navigation', 'paint', 'layout-shift', 'largest-contentful-paint'] });
};

/**
 * Initialize all monitoring
 */
export const initializeMonitoring = () => {
  if (__PROD__) {
    initializeAnalytics();
    trackBundlePerformance();
    trackUserExperience();
    
    // Set up error tracking
    window.addEventListener('error', (event) => {
      trackThemeError(new Error(event.message), 'javascript_error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      trackThemeError(new Error(event.reason), 'unhandled_promise_rejection');
    });
    
    console.log('Production monitoring initialized');
  }
};

// Auto-initialize in production
if (__PROD__) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMonitoring);
  } else {
    initializeMonitoring();
  }
}
