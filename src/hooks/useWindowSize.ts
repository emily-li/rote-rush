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
    visibleHeight:
      typeof window !== 'undefined' ? window.innerHeight : BASE_AREA ** 0.5,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let visibleHeight = height;

      if (window.visualViewport) {
        visibleHeight = window.visualViewport.height;
      }

      setSize({ width, height, visibleHeight });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return size;
}
