import { useEffect, useState } from 'react';

/** Client-side hash routing — mirrors legacy src/Shell.jsx useHashRoute(). */
export function useHashRoute() {
  const [path, setPath] = useState(() => {
    const h = window.location.hash.replace(/^#/, '') || '/';
    return h;
  });

  useEffect(() => {
    const onHash = () => {
      setPath(window.location.hash.replace(/^#/, '') || '/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return path;
}