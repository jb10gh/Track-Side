import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyGameModal = lazy(() => import('../components/game/GameModal'));
export const LazySwipeStream = lazy(() => import('../components/game/SwipeStream'));
export const LazyMatchArchive = lazy(() => import('../components/home/MatchArchive'));
export const LazyAnalytics = lazy(() => import('../components/analytics/AnalyticsDashboard'));

// Preload critical components
export const preloadCriticalComponents = () => {
  import('../components/game/GestureDeckOptimized');
  import('../components/game/FloatingHUD');
};
