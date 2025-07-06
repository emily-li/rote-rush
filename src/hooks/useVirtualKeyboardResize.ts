import { useEffect } from 'react';

const setViewportHeight = () => {
  if (window.visualViewport) {
    document.documentElement.style.setProperty(
      '--visual-viewport-height',
      `${window.visualViewport.height}px`,
    );
  }
};

export const useVirtualKeyboardResize = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    setViewportHeight();

    const resizeObserver = window.visualViewport;
    resizeObserver.addEventListener('resize', setViewportHeight);

    return () => {
      resizeObserver.removeEventListener('resize', setViewportHeight);
    };
  }, []);
};
