// Performance optimization utilities

// Lazy load heavy components
export const lazyLoad = (importFunc) => {
  return React.lazy(importFunc);
};

// Debounce utility for search/filter operations
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

// Throttle utility for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Web Vitals monitoring
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Cache for expensive computations
export class ComputationCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (LRU)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(name) {
    this.metrics.set(name, performance.now());
  }

  endTimer(name) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      return duration;
    }
    return null;
  }

  measure(name, fn) {
    this.startTimer(name);
    const result = fn();
    const duration = this.endTimer(name);
    console.log(`${name}: ${duration.toFixed(2)}ms`);
    return result;
  }

  async measureAsync(name, fn) {
    this.startTimer(name);
    const result = await fn();
    const duration = this.endTimer(name);
    console.log(`${name}: ${duration.toFixed(2)}ms`);
    return result;
  }
}

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options;

  if (!src) return src;

  // If it's already an optimized URL, return as-is
  if (src.includes('?')) return src;

  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  params.append('q', quality);
  params.append('f', format);

  return `${src}?${params.toString()}`;
};

// Bundle size optimization
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/inter-var.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'preload';
  cssLink.href = '/css/critical.css';
  cssLink.as = 'style';
  document.head.appendChild(cssLink);
};

// Memory leak prevention
export const cleanup = {
  // Remove event listeners
  removeEventListener: (element, event, handler) => {
    element.removeEventListener(event, handler);
  },

  // Clear intervals
  clearInterval: (intervalId) => {
    clearInterval(intervalId);
  },

  // Clear timeouts
  clearTimeout: (timeoutId) => {
    clearTimeout(timeoutId);
  },

  // Cancel animation frames
  cancelAnimationFrame: (frameId) => {
    cancelAnimationFrame(frameId);
  }
};

// Request idle callback for non-critical tasks
export const runWhenIdle = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1);
  }
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

// Critical CSS inlining
export const injectCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'api.example.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect for critical domains
  const criticalDomains = ['fonts.gstatic.com'];
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${domain}`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Performance singleton
export const performance = new PerformanceMonitor();
export const cache = new ComputationCache();
