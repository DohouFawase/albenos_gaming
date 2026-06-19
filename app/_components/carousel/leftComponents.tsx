import React, { useState, useEffect, useRef, useCallback } from 'react';

const SLIDES = [
  { src: '/carousel/carousel1.png', label: 'Game 01' },
  { src: '/carousel/carousel2.png', label: 'Game 02' },
  { src: '/carousel/carousel3.png', label: 'Game 03' },
  { src: '/carousel/carousel4.png', label: 'Game 04' },
  { src: '/carousel/carousel5.png', label: 'Game 05' },
  { src: '/carousel/carousel6.png', label: 'Game 06' },
  { src: '/carousel/carousel7.png', label: 'Game 07' },
];

const GamingCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = useCallback((dir: number) => {
    setCurrent(prev => (prev + dir + SLIDES.length) % SLIDES.length);
  }, []);

  const resetAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => move(1), 3500);
  }, [move]);

  useEffect(() => {
    resetAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetAuto]);

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0a0a0f',
      borderRadius: 12,
      padding: '32px 0',
      overflow: 'hidden',
    }}>
      {/* HUD bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#534ab7', letterSpacing: 2, textTransform: 'uppercase' }}>
           GAME COLLECTION
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#534ab7' }}>
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Arrow left */}
      <button onClick={() => { move(-1); resetAuto(); }} style={arrowStyle('left')} aria-label="Précédent">‹</button>

      {/* Track */}
      <div style={{ display: 'flex', gap: 20, padding: '0 60px', overflowX: 'hidden' }}>
        {SLIDES.map((slide, i) => {
          const isActive = i === current;
          return (
            <div
              key={i}
              onClick={() => { setCurrent(i); resetAuto(); }}
              style={{
                flex: `0 0 ${isActive ? 260 : 220}px`,
                height: 320,
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                border: isActive ? '1.5px solid #7f77dd' : '1.5px solid #2a2a3a',
                boxShadow: isActive ? '0 0 24px rgba(127,119,221,0.35)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <img src={slide.src} alt={slide.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,15,0.85) 0%, transparent 50%)',
              }} />
              {isActive && (
                <span style={{
                  position: 'absolute', bottom: 14, left: 14,
                  color: '#e0dff8', fontSize: 13, fontWeight: 500,
                }}>
                  {slide.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrow right */}
      <button onClick={() => { move(1); resetAuto(); }} style={arrowStyle('right')} aria-label="Suivant">›</button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => { setCurrent(i); resetAuto(); }}
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: i === current ? 3 : '50%',
              background: i === current ? '#7f77dd' : '#2a2a3a',
              border: `1px solid ${i === current ? '#7f77dd' : '#3c3489'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [side]: 8,
  transform: 'translateY(-50%)',
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: 'rgba(127,119,221,0.15)',
  border: '1.5px solid #534ab7',
  color: '#afa9ec',
  fontSize: 24,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
});

export default GamingCarousel;