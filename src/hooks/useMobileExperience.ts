/**
 * Mobile Experience Hook
 * 
 * One-handed mode, ambient display widgets, offline capabilities
 * Implements the "Athletic Intelligence" design system
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { UserContext, GameContext } from '../types/design-system';

/**
 * One-handed mode detection and optimization
 */
export const useOneHandedMode = () => {
  const [isOneHanded, setIsOneHanded] = useState(false);
  const [dominantHand, setDominantHand] = useState<'left' | 'right'>('right');
  const touchPoints = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);

  // Detect one-handed usage based on touch patterns
  const detectOneHandedUsage = useCallback(() => {
    if (touchPoints.current.length < 3) return false;

    // Analyze touch patterns
    const recentTouches = touchPoints.current.slice(-10);
    const xValues = recentTouches.map(t => t.x);
    const yValues = recentTouches.map(t => t.y);
    
    // Calculate touch distribution
    const xRange = Math.max(...xValues) - Math.min(...xValues);
    const yRange = Math.max(...yValues) - Math.min(...yValues);
    const screenWidth = window.innerWidth;
    
    // If touches are concentrated in one area, likely one-handed
    const concentrationRatio = (xRange / screenWidth);
    const isConcentrated = concentrationRatio < 0.3;
    
    // Detect dominant hand based on touch position
    const avgX = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
    const detectedHand = avgX < screenWidth / 2 ? 'left' : 'right';
    
    setDominantHand(detectedHand);
    return isConcentrated;
  }, []);

  // Track touch events
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        touchPoints.current.push({
          x: touch.clientX,
          y: touch.clientY,
          timestamp: Date.now(),
        });
        
        // Keep only recent touches
        if (touchPoints.current.length > 20) {
          touchPoints.current = touchPoints.current.slice(-20);
        }
        
        // Update one-handed mode
        const oneHanded = detectOneHandedUsage();
        setIsOneHanded(oneHanded);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [detectOneHandedUsage]);

  // Get optimized layout for one-handed mode
  const getOneHandedLayout = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (dominantHand === 'left') {
      return {
        primaryZone: { x: 20, y: screenHeight - 200, width: 120, height: 180 },
        secondaryZone: { x: 150, y: screenHeight - 200, width: screenWidth - 170, height: 180 },
        safeArea: { left: 0, right: screenWidth * 0.6, top: 0, bottom: screenHeight },
      };
    } else {
      return {
        primaryZone: { x: screenWidth - 140, y: screenHeight - 200, width: 120, height: 180 },
        secondaryZone: { x: 20, y: screenHeight - 200, width: screenWidth - 170, height: 180 },
        safeArea: { left: screenWidth * 0.4, right: screenWidth, top: 0, bottom: screenHeight },
      };
    }
  }, [dominantHand]);

  return {
    isOneHanded,
    dominantHand,
    getOneHandedLayout,
  };
};

/**
 * Ambient display widgets for lock screen and notifications
 */
export const useAmbientDisplay = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [widgetData, setWidgetData] = useState({
    score: { ourTeam: 0, opponent: 0 },
    timer: { elapsed: 0, isRunning: false },
    status: 'idle' as 'idle' | 'active' | 'paused' | 'completed',
  });

  // Check ambient display support
  useEffect(() => {
    const checkSupport = () => {
      const hasAmbient = 'ambient' in window || 'ambient-light' in window;
      const hasNotification = 'Notification' in window;
      const hasLockScreen = 'screen' in navigator && 'lock' in navigator.screen;
      
      setIsSupported(hasAmbient || hasNotification || hasLockScreen);
    };

    checkSupport();
  }, []);

  // Update widget data
  const updateWidgetData = useCallback((gameState: GameContext) => {
    setWidgetData({
      score: {
        ourTeam: gameState.myScore,
        opponent: gameState.opponentScore,
      },
      timer: {
        elapsed: gameState.timeInGame,
        isRunning: gameState.isRunning,
      },
      status: gameState.isRunning ? 'active' : 'paused',
    });
  }, []);

  // Create lock screen widget
  const createLockScreenWidget = useCallback(() => {
    if (!isSupported) return null;

    const widgetHTML = `
      <div class="ambient-widget">
        <div class="score-display">
          <span class="our-score">${widgetData.score.ourTeam}</span>
          <span class="vs">-</span>
          <span class="opponent-score">${widgetData.score.opponent}</span>
        </div>
        <div class="timer-display">
          <span class="time">${widgetData.timer.elapsed}</span>
          <span class="status ${widgetData.status}"></span>
        </div>
      </div>
    `;

    return widgetHTML;
  }, [isSupported, widgetData]);

  // Show notification
  const showNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/pwa-icon.png',
        badge: '/pwa-icon.png',
        tag: 'track-side-game',
        requireInteraction: false,
      });
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    isSupported,
    widgetData,
    updateWidgetData,
    createLockScreenWidget,
    showNotification,
    requestNotificationPermission,
  };
};

/**
 * Offline capabilities and data synchronization
 */
export const useOfflineCapabilities = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'error'>('synced');
  const [offlineData, setOfflineData] = useState<any[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOfflineMode(false);
      // Trigger sync when coming back online
      if (offlineData.length > 0) {
        syncOfflineData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineData.length]);

  // Store data for offline use
  const storeOfflineData = useCallback((data: any) => {
    try {
      const existingData = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      const newData = [...existingData, { ...data, timestamp: Date.now() }];
      localStorage.setItem('offlineGameData', JSON.stringify(newData));
      setOfflineData(newData);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }, []);

  // Sync offline data when online
  const syncOfflineData = useCallback(async () => {
    if (!isOnline) return;

    setSyncStatus('pending');
    
    try {
      const data = JSON.parse(localStorage.getItem('offlineGameData') || '[]');
      
      // Here you would sync with your backend
      // For now, we'll just clear the local storage
      localStorage.removeItem('offlineGameData');
      setOfflineData([]);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
      setSyncStatus('error');
    }
  }, [isOnline]);

  // Get offline data
  const getOfflineData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('offlineGameData') || '[]');
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return [];
    }
  }, []);

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    try {
      localStorage.removeItem('offlineGameData');
      setOfflineData([]);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, []);

  return {
    isOnline,
    isOfflineMode,
    syncStatus,
    offlineData,
    storeOfflineData,
    syncOfflineData,
    getOfflineData,
    clearOfflineData,
  };
};

/**
 * Mobile performance optimization
 */
export const useMobilePerformance = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    batteryLevel: 100,
    thermalState: 'normal' as 'normal' | 'hot' | 'critical',
  });

  // Monitor FPS
  useEffect(() => {
    let fps = 60;
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        setPerformanceMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / memory.totalJSHeapSize * 100;
        
        setPerformanceMetrics(prev => ({ ...prev, memoryUsage: usedMemory }));
      }
    };

    const interval = setInterval(measureMemory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Monitor battery level
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setPerformanceMetrics(prev => ({
            ...prev,
            batteryLevel: battery.level * 100,
            thermalState: battery.charging ? 'normal' : 'hot',
          }));
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);

        return () => {
          battery.removeEventListener('levelchange', updateBattery);
          battery.removeEventListener('chargingchange', updateBattery);
        };
      }).catch(() => {
        // Battery API not available
      });
    }
  }, []);

  // Get performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations = [];

    if (performanceMetrics.fps < 30) {
      recommendations.push('Consider reducing animations or visual effects');
    }

    if (performanceMetrics.memoryUsage > 80) {
      recommendations.push('Memory usage is high, consider data cleanup');
    }

    if (performanceMetrics.batteryLevel < 20) {
      recommendations.push('Battery level is low, enable battery optimization');
    }

    if (performanceMetrics.thermalState === 'critical') {
      recommendations.push('Device is overheating, reduce processing load');
    }

    return recommendations;
  }, [performanceMetrics]);

  return {
    performanceMetrics,
    getPerformanceRecommendations,
  };
};

/**
 * Main mobile experience hook
 */
export const useMobileExperience = (userContext: UserContext) => {
  const oneHanded = useOneHandedMode();
  const ambientDisplay = useAmbientDisplay();
  const offline = useOfflineCapabilities();
  const performance = useMobilePerformance();

  // Update ambient display with game state
  const updateAmbientDisplay = useCallback((gameState: GameContext) => {
    ambientDisplay.updateWidgetData(gameState);
    
    // Show notification for important events
    if (gameState.myScore > 0 || gameState.opponentScore > 0) {
      ambientDisplay.showNotification(
        'Game Update',
        `Score: ${gameState.myScore} - ${gameState.opponentScore}`
      );
    }
  }, [ambientDisplay]);

  // Get mobile experience status
  const getMobileStatus = useCallback(() => ({
    oneHanded: {
      enabled: oneHanded.isOneHanded,
      dominantHand: oneHanded.dominantHand,
      layout: oneHanded.getOneHandedLayout(),
    },
    ambient: {
      supported: ambientDisplay.isSupported,
      widgetData: ambientDisplay.widgetData,
    },
    offline: {
      isOnline: offline.isOnline,
      isOfflineMode: offline.isOfflineMode,
      syncStatus: offline.syncStatus,
      offlineDataCount: offline.offlineData.length,
    },
    performance: {
      metrics: performance.performanceMetrics,
      recommendations: performance.getPerformanceRecommendations(),
    },
  }), [oneHanded, ambientDisplay, offline, performance]);

  return {
    // One-handed mode
    isOneHanded: oneHanded.isOneHanded,
    dominantHand: oneHanded.dominantHand,
    getOneHandedLayout: oneHanded.getOneHandedLayout,
    
    // Ambient display
    ambientDisplay,
    updateAmbientDisplay,
    
    // Offline capabilities
    offline,
    
    // Performance
    performance,
    
    // Status
    getMobileStatus,
  };
};

export default useMobileExperience;
