import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsApi } from '@/lib/api';

let usageStartTime: number | null = null;
let usageInterval: NodeJS.Timeout | null = null;

export function useEngagementTracking() {
  const { user, isAuthenticated } = useAuth();

  // Track click events
  const trackClick = useCallback((target: string, targetId?: string, location?: string) => {
    if (!isAuthenticated || !user) return;

    try {
      analyticsApi.trackClick(target, targetId, location);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }, [isAuthenticated, user]);

  // Start tracking usage time
  const startUsageTracking = useCallback(() => {
    if (!isAuthenticated || !user || usageStartTime !== null) return;

    usageStartTime = Date.now();

    // Track usage every 5 minutes
    usageInterval = setInterval(async () => {
      if (usageStartTime) {
        const minutes = Math.floor((Date.now() - usageStartTime) / 60000);
        try {
          await analyticsApi.trackUsage(minutes);
        } catch (error) {
          console.error('Failed to track usage:', error);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }, [isAuthenticated, user]);

  // Stop tracking usage time
  const stopUsageTracking = useCallback(() => {
    if (usageStartTime && isAuthenticated && user) {
      const minutes = Math.floor((Date.now() - usageStartTime) / 60000);
      try {
        analyticsApi.trackUsage(minutes);
      } catch (error) {
        console.error('Failed to track usage:', error);
      }
      usageStartTime = null;
    }

    if (usageInterval) {
      clearInterval(usageInterval);
      usageInterval = null;
    }
  }, [isAuthenticated, user]);

  // Track page visibility changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopUsageTracking();
      } else {
        startUsageTracking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startUsageTracking();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopUsageTracking();
    };
  }, [isAuthenticated, user, startUsageTracking, stopUsageTracking]);

  // Track before unload
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const handleBeforeUnload = () => {
      stopUsageTracking();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated, user, stopUsageTracking]);

  return { trackClick, startUsageTracking, stopUsageTracking };
}

