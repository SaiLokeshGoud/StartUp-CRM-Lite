/**
 * SplashLoader.jsx
 *
 * Full-screen branded splash screen for Startup CRM.
 * The logo uses the same Lucide Activity (heartbeat/ECG) path.
 * The waveform is animated with SVG stroke-dasharray/dashoffset so the pulse
 * appears to be drawn/traveling from left to right, like an ECG monitor.
 */
export default function SplashLoader({ isFadingOut }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Startup CRM"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFadingOut ? 'scale(0.94)' : 'scale(1)',
        }}
      >
        {/* ── Animated Heartbeat Logo ── */}
        <div
          className="splash-logo-container"
          style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(239, 246, 255, 1)',   /* blue-50 */
          }}
        >
          {/* Blue glow ring — pulses at heartbeat peak */}
          <div
            className="splash-logo-glow dark:opacity-60"
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '24px',
              background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)',
              animation: 'splashGlowPulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              opacity: 0.3,
            }}
          />

          {/* Faint static complete waveform underneath for visual context */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="48"
            height="48"
            style={{ position: 'absolute' }}
            aria-hidden="true"
          >
            <polyline
              points="22 12 18 12 15 21 9 3 6 12 2 12"
              stroke="rgba(59,130,246,0.15)"
              strokeWidth="2"
            />
          </svg>

          {/* Animated ECG heartbeat path — draws left to right */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="48"
            height="48"
            style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.6))' }}
            aria-hidden="true"
          >
            {/*
              Lucide Activity polyline: "22 12 18 12 15 21 9 3 6 12 2 12"
              Total approximate path length: ~46 units
              We animate dashoffset from 46 → 0 to "draw" it left to right
            */}
            <polyline
              points="22 12 18 12 15 21 9 3 6 12 2 12"
              stroke="#3b82f6"
              strokeWidth="2"
              style={{
                strokeDasharray: 46,
                strokeDashoffset: 46,
                animation: 'splashHeartbeat 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
          </svg>
        </div>

        {/* ── Brand Labels ── */}
        <div
          className="splash-brand-text"
          style={{
            marginTop: '24px',
            textAlign: 'center',
            animation: 'splashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms both',
          }}
        >
          <p
            className="text-blue-600"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            STARTUP CRM
          </p>
          <h1
            className="text-slate-900 dark:text-white"
            style={{
              marginTop: '8px',
              fontSize: 'clamp(18px, 4vw, 22px)',
              fontWeight: 800,
              lineHeight: 1.2,
              margin: '8px 0 0',
            }}
          >
            Operations Hub
          </h1>
        </div>

        {/* ── Thin Loading Bar ── */}
        <div
          style={{
            marginTop: '28px',
            width: 'clamp(140px, 30vw, 180px)',
            height: '3px',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
            animation: 'splashFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 350ms both',
          }}
          className="bg-slate-200 dark:bg-slate-800"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '35%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, rgba(59,130,246,0.6), #3b82f6, rgba(59,130,246,0.6))',
              animation: 'splashProgressBar 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
