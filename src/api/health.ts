/**
 * Health Check API Endpoint
 * 
 * Provides comprehensive health monitoring for the Track Side application
 * Monitors theme system, performance, memory, and cache status
 */

// Environment variables
declare const __VERSION__: string;

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime?: number;
  responseTime?: number;
  error?: string;
  checks?: {
    theme: HealthCheckResult;
    performance: HealthCheckResult;
    memory: HealthCheckResult;
    cache: HealthCheckResult;
    api: HealthCheckResult;
  };
}

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: any;
  metrics?: any;
  error?: string;
}

interface PerformanceMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
}

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

interface CacheMetrics {
  cacheCount: number;
  totalEntries: number;
  cacheNames: string[];
}

interface SystemInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  onLine: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
  screenResolution: string;
  colorDepth: number;
  pixelDepth: number;
}

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
}

/**
 * Main health check endpoint
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  const startTime = Date.now();
  
  try {
    const checks = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      version: __VERSION__ || 'unknown',
      uptime: typeof process !== 'undefined' && process.uptime ? Math.floor(process.uptime()) : null,
      checks: {
        theme: await checkThemeSystem(),
        performance: await checkPerformance(),
        memory: await checkMemory(),
        cache: await checkCache(),
        api: await checkApiConnectivity()
      }
    };

    const allHealthy = Object.values(checks.checks).every(check => check.status === 'healthy');
    checks.status = allHealthy ? 'healthy' : 'unhealthy';
    checks.responseTime = Date.now() - startTime;

    return checks;
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: __VERSION__ || 'unknown',
      error: (error as Error).message,
      responseTime: Date.now() - startTime
    };
  }
};

/**
 * Check theme system health
 */
const checkThemeSystem = async (): Promise<HealthCheckResult> => {
  try {
    // Check if theme CSS is loaded
    const rootStyles = getComputedStyle(document.documentElement);
    const brandColor = rootStyles.getPropertyValue('--brand-primary');
    const teamOurColor = rootStyles.getPropertyValue('--team-our-primary');
    const teamTheirColor = rootStyles.getPropertyValue('--team-their-primary');
    
    const themeChecks = {
      cssLoaded: brandColor !== '',
      brandColorDefined: brandColor === '#FF1493',
      teamColorsDefined: teamOurColor === '#FF1493' && teamTheirColor === '#FF007F',
      spacingDefined: rootStyles.getPropertyValue('--spacing-md') !== '',
      typographyDefined: rootStyles.getPropertyValue('--font-primary') !== ''
    };

    const allChecksPassed = Object.values(themeChecks).every(check => check);
    
    return {
      status: allChecksPassed ? 'healthy' : 'unhealthy',
      message: allChecksPassed ? 'Theme system loaded successfully' : 'Theme system issues detected',
      details: themeChecks,
      metrics: {
        brandColor: brandColor || 'not_found',
        teamOurColor: teamOurColor || 'not_found',
        teamTheirColor: teamTheirColor || 'not_found',
        cssVariables: Object.keys(rootStyles).filter(key => key.startsWith('--')).length
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Theme system check failed',
      error: (error as Error).message
    };
  }
};

/**
 * Check performance metrics
 */
const checkPerformance = async (): Promise<HealthCheckResult> => {
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0;
    
    const metrics: PerformanceMetrics = {
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      timeToInteractive: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0
    };

    const performanceChecks = {
      fcpAcceptable: fcp < 2000,
      lcpAcceptable: lcp < 2500,
      loadTimeAcceptable: metrics.loadComplete < 3000,
      interactiveAcceptable: metrics.timeToInteractive < 3000
    };

    const allChecksPassed = Object.values(performanceChecks).every(check => check);
    
    return {
      status: allChecksPassed ? 'healthy' : 'unhealthy',
      message: allChecksPassed ? 'Performance metrics are acceptable' : 'Performance issues detected',
      details: performanceChecks,
      metrics
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Performance check failed',
      error: (error as Error).message
    };
  }
};

/**
 * Check memory usage
 */
const checkMemory = async (): Promise<HealthCheckResult> => {
  try {
    const memory = (performance as any).memory;
    
    if (!memory) {
      return {
        status: 'healthy',
        message: 'Memory API not available',
        metrics: null
      };
    }

    const memoryUsage: MemoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };

    const memoryChecks = {
      usageAcceptable: memoryUsage.usagePercentage < 80,
      notNearLimit: memoryUsage.usedJSHeapSize < memoryUsage.jsHeapSizeLimit * 0.9
    };

    const allChecksPassed = Object.values(memoryChecks).every(check => check);
    
    return {
      status: allChecksPassed ? 'healthy' : 'unhealthy',
      message: allChecksPassed ? 'Memory usage is acceptable' : 'Memory usage is high',
      details: memoryChecks,
      metrics: {
        usedJSHeapSizeMB: Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSizeMB: Math.round(memoryUsage.totalJSHeapSize / 1024 / 1024),
        jsHeapSizeLimitMB: Math.round(memoryUsage.jsHeapSizeLimit / 1024 / 1024),
        usagePercentage: Math.round(memoryUsage.usagePercentage * 100) / 100
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Memory check failed',
      error: (error as Error).message
    };
  }
};

/**
 * Check cache status
 */
const checkCache = async (): Promise<HealthCheckResult> => {
  try {
    if (!('caches' in window)) {
      return {
        status: 'healthy',
        message: 'Cache API not available',
        metrics: null
      };
    }

    const cacheNames = await caches.keys();
    const cacheDetails = [];
    
    for (const cacheName of cacheNames) {
      try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        const size = keys.length;
        
        cacheDetails.push({
          name: cacheName,
          size,
          keys: keys.map(key => key.url).slice(0, 5) // First 5 keys
        });
      } catch (error) {
        cacheDetails.push({
          name: cacheName,
          size: 0,
          error: (error as Error).message
        });
      }
    }

    const cacheChecks = {
      cachesAvailable: cacheNames.length > 0,
      noCacheErrors: cacheDetails.every(detail => !detail.error)
    };

    const allChecksPassed = Object.values(cacheChecks).every(check => check);
    
    return {
      status: allChecksPassed ? 'healthy' : 'unhealthy',
      message: allChecksPassed ? 'Cache system is working' : 'Cache issues detected',
      details: cacheChecks,
      metrics: {
        cacheCount: cacheNames.length,
        totalEntries: cacheDetails.reduce((sum, detail) => sum + detail.size, 0),
        cacheNames
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Cache check failed',
      error: (error as Error).message
    };
  }
};

/**
 * Check API connectivity
 */
const checkApiConnectivity = async (): Promise<HealthCheckResult> => {
  try {
    // Check if we can make a basic API call
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        status: 'healthy',
        message: 'API connectivity is working',
        metrics: {
          responseTime: response.headers.get('x-response-time') || 'unknown',
          status: response.status
        }
      };
    } else {
      return {
        status: 'unhealthy',
        message: 'API returned error status',
        metrics: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'API connectivity failed',
      error: (error as Error).message
    };
  }
};

/**
 * Simple health check for load balancers
 */
export const simpleHealthCheck = async (): Promise<{ status: string; timestamp: string; error?: string }> => {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message
    };
  }
};

/**
 * Check theme-specific health
 */
export const themeHealthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const themeSystem = await checkThemeSystem();
    const performance = await checkPerformance();
    
    const isHealthy = themeSystem.status === 'healthy' && performance.status === 'healthy';
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: __VERSION__ || 'unknown',
      checks: {
        theme: themeSystem,
        performance
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: __VERSION__ || 'unknown',
      error: (error as Error).message
    };
  }
};

/**
 * Get detailed system information
 */
export const getSystemInfo = async () => {
  try {
    const health = await healthCheck();
    
    return {
      ...health,
      system: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      browser: {
        name: getBrowserName(),
        version: getBrowserVersion(),
        engine: getBrowserEngine()
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: __VERSION__ || 'unknown',
      error: (error as Error).message
    };
  }
};

/**
 * Get browser information
 */
const getBrowserName = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown';
};

const getBrowserVersion = (): string => {
  const userAgent = navigator.userAgent;
  const browserName = getBrowserName();
  
  const match = userAgent.match(new RegExp(`${browserName}/([\\d.]+)`));
  return match ? match[1] : 'Unknown';
};

const getBrowserEngine = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('WebKit')) return 'WebKit';
  if (userAgent.includes('Gecko')) return 'Gecko';
  if (userAgent.includes('Presto')) return 'Presto';
  if (userAgent.includes('Trident')) return 'Trident';
  
  return 'Unknown';
};
