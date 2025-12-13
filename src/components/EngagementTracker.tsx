import { useEngagementTracking } from '@/hooks/useEngagementTracking';

export function EngagementTracker() {
  useEngagementTracking();
  return null; // This component doesn't render anything
}

