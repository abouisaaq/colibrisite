export function HeroWave() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30" aria-hidden>
      <svg
        className="relative block h-[72px] w-full sm:h-[110px] lg:h-[120px]"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-wave-stroke" x1="0" y1="0" x2="1440" y2="0">
            <stop offset="0%" stopColor="#42D7C8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#4A8BFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6B4EFF" stopOpacity="0.35" />
          </linearGradient>
          <filter id="hero-wave-shadow" x="-10%" y="-30%" width="120%" height="160%">
            <feDropShadow dx="0" dy="-6" stdDeviation="14" floodOpacity="0.07" />
          </filter>
        </defs>

        <path
          d="M0,95 C160,125 360,70 560,88 C760,106 960,58 1160,76 C1280,88 1360,82 1440,74 L1440,150 L0,150 Z"
          fill="#F8FAFC"
          opacity="0.55"
        />
        <path
          d="M0,105 C200,138 400,78 600,96 C800,114 1000,64 1200,82 C1300,92 1380,88 1440,82 L1440,150 L0,150 Z"
          fill="#FFFFFF"
          opacity="0.9"
          filter="url(#hero-wave-shadow)"
        />
        <path
          d="M0,114 C240,148 460,90 680,106 C900,122 1100,72 1320,90 C1380,96 1410,92 1440,88 L1440,150 L0,150 Z"
          fill="#FFFFFF"
        />
        <path
          d="M0,114 C240,148 460,90 680,106 C900,122 1100,72 1320,90 C1380,96 1410,92 1440,88"
          fill="none"
          stroke="url(#hero-wave-stroke)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
