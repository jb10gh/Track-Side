// Performance utility functions

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

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory-efficient event cleanup
export const cleanupOldEvents = (events, maxAge = 24 * 60 * 60 * 1000) => {
  const cutoff = Date.now() - maxAge;
  return events.filter(event => event.timestamp > cutoff);
};

// Optimized roster management
export const optimizeRoster = (roster, maxSize = 20) => {
  // Remove duplicates and keep most recent
  const uniqueRoster = [...new Set(roster)];
  return uniqueRoster.slice(0, maxSize);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Bundle size monitoring
export const logBundleSize = () => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('chunk')) {
          // eslint-disable-next-line no-console
          console.log(`Bundle chunk ${entry.name}: ${entry.transferSize} bytes`);
        }
      }
    });
    observer.observe({ entryTypes: ['resource'] });
  }
};
