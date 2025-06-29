import { useEffect, useState } from 'react';

const BASE_AREA = 1920 * 1080;

/**
 * SSR-safe window size hook for responsive layouts
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : BASE_AREA ** 0.5,
    height:
      typeof window !== 'undefined' ? window.innerHeight : BASE_AREA ** 0.5,
  });
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}
