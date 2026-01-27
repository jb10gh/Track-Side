import { useCallback, useRef, useEffect, useState } from 'react';
import { throttle, debounce } from '../utils/performanceHelpers';

// Performance optimization hook for gesture handling
export const usePerformanceOptimization = () => {
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Throttled gesture handler for smooth 60fps
  const throttledGestureHandler = useCallback(
    throttle((callback) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const now = performance.now();
        if (now - lastUpdateRef.current >= 16.67) { // 60fps = 16.67ms per frame
          callback();
          lastUpdateRef.current = now;
        }
      });
    }, 16),
    []
  );

  // Debounced search for roster filtering
  const debouncedSearch = useCallback(
    debounce((query, callback) => {
      callback(query);
    }, 300),
    []
  );

  // Memory cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    throttledGestureHandler,
    debouncedSearch
  };
};

// Event pagination for long timelines
export const useEventPagination = (events, pageSize = 50) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedEvents, setPaginatedEvents] = useState([]);

  useEffect(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedEvents(events.slice(startIndex, endIndex));
  }, [events, currentPage, pageSize]);

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return {
    paginatedEvents,
    loadMore,
    resetPagination,
    hasMore: paginatedEvents.length < events.length
  };
};
