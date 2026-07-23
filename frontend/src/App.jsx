import { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes';
import SplashLoader from './components/common/SplashLoader';

/**
 * Minimum time (ms) the splash must be visible so the heartbeat animation
 * is perceived as intentional and the exit doesn't feel like a flash.
 */
const MIN_SPLASH_MS = 700;
/** Duration (ms) of the fade-out transition on SplashLoader */
const EXIT_MS = 400;

function App() {
  const { isLoading: authLoading } = useAuth();
  const mountAt = useRef(Date.now());

  // showSplash  → whether the component is in the DOM
  // isFadingOut → whether it's in its exit animation phase
  const [showSplash, setShowSplash]     = useState(true);
  const [isFadingOut, setIsFadingOut]   = useState(false);

  useEffect(() => {
    if (authLoading) return; // still initialising — keep loader visible

    const elapsed   = Date.now() - mountAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);                          // start CSS fade-out
      const removeTimer = setTimeout(() => {
        setShowSplash(false);                        // remove from DOM
      }, EXIT_MS);
      return () => clearTimeout(removeTimer);
    }, remaining);

    return () => clearTimeout(fadeTimer);
  }, [authLoading]);

  // Prevent page scroll while the splash is covering the viewport
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashLoader isFadingOut={isFadingOut} />}
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
