import { useEffect } from 'react';
import { useEngagementTracking } from './useEngagementTracking';

export function useClickTracking() {
  const { trackClick } = useEngagementTracking();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Only track meaningful clicks (buttons, links, cards, etc.)
      const isTrackable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.card') ||
        target.closest('[data-track]');

      if (isTrackable) {
        const targetId = target.id || target.getAttribute('data-id') || undefined;
        const location = window.location.pathname;
        const targetName = target.getAttribute('data-track') || 
                          target.textContent?.trim().substring(0, 50) || 
                          target.tagName.toLowerCase();

        trackClick(targetName, targetId, location);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [trackClick]);
}

