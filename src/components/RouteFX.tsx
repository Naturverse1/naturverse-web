import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteFX
 * Adds a subtle page fade-in on every navigation.
 * No wrappers or layout changes required—just mount once in App.
 */
export default function RouteFX() {
  const location = useLocation();

  useEffect(() => {
    const el = document.documentElement; // <html>
    // Start state
    el.classList.add('page-enter');
    // Next frame -> animate in
    const id = requestAnimationFrame(() => {
      el.classList.add('page-enter-active');
      // Clean up after transition ends
      const clear = () => {
        el.classList.remove('page-enter');
        el.classList.remove('page-enter-active');
      };
      // Fallback in case transitionend doesn’t fire
      const timer = setTimeout(clear, 600);
      const onEnd = () => {
        clear();
        clearTimeout(timer);
        el.removeEventListener('transitionend', onEnd);
      };
      el.addEventListener('transitionend', onEnd);
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return null;
}

