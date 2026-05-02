'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HERO_VIDEO_SELECTOR = 'video.hero-video';

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const userInteractedRef = useRef(false);

  const getVideo = useCallback((): HTMLVideoElement | null => {
    if (typeof document === 'undefined') return null;
    return document.querySelector<HTMLVideoElement>(HERO_VIDEO_SELECTOR);
  }, []);

  const enableSound = useCallback(() => {
    const video = getVideo();
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.muted = true;
        setIsPlaying(false);
      });
    }
    setIsPlaying(true);
  }, [getVideo]);

  const disableSound = useCallback(() => {
    const video = getVideo();
    if (!video) return;
    video.muted = true;
    setIsPlaying(false);
  }, [getVideo]);

  const handleToggle = useCallback(() => {
    userInteractedRef.current = true;
    if (isPlaying) {
      disableSound();
    } else {
      enableSound();
    }
  }, [isPlaying, enableSound, disableSound]);

  useEffect(() => {
    const handleScroll = () => {
      if (userInteractedRef.current) return;
      if (window.scrollY <= 0) return;
      userInteractedRef.current = true;
      enableSound();
      window.removeEventListener('scroll', handleScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableSound]);

  return (
    <button
      type="button"
      className={`audio-toggle ${isPlaying ? 'audio-toggle--playing' : ''}`}
      aria-label={isPlaying ? 'Mute background audio' : 'Play background audio'}
      aria-pressed={isPlaying}
      onClick={handleToggle}
    >
      <span className="audio-toggle__icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V6l10-2v12" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="16" cy="16" r="2.5" />
          {isPlaying ? (
            <>
              <path className="audio-toggle__wave audio-toggle__wave--1" d="M21 8c1.2 1 1.2 4 0 5" />
              <path className="audio-toggle__wave audio-toggle__wave--2" d="M22.6 6c2.2 1.8 2.2 8.2 0 10" />
            </>
          ) : (
            <line x1="3" y1="3" x2="23" y2="21" />
          )}
        </svg>
      </span>
    </button>
  );
}
