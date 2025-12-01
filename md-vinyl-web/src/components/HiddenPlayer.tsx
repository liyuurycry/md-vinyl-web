'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';

export default function HiddenPlayer() {
  const { isPlaying, currentIndex, nextTrack, setPlay, volume, isMuted } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isPlaying) {
        player.playVideo(); 
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isMuted) {
        player.mute();
      } else {
        player.unMute();
        player.setVolume(volume);
      }
    }
  }, [volume, isMuted, isReady]);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      playsinline: 1, 
    },
  };

  return (
    // ✅ 這裡改用 style 直接設定，就算 Tailwind 壞了它也會乖乖隱藏
    <div 
      style={{ 
        position: 'fixed', 
        top: '-10000px', 
        left: '-10000px', 
        width: '1px', 
        height: '1px', 
        overflow: 'hidden',
        visibility: 'hidden',
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      <YouTube
        videoId={currentSong.youtubeId}
        opts={opts}
        onReady={(event: any) => {
          playerRef.current = event.target;
          setIsReady(true);
          event.target.setVolume(volume);
          if(isMuted) event.target.mute();
          if (isPlaying) event.target.playVideo();
        }}
        onStateChange={(event: any) => {
          if (event.data === 0) nextTrack();
          if (event.data === 1 && !isPlaying) setPlay(true);
          if (event.data === 2 && isPlaying) setPlay(false);
        }}
        onError={(e: any) => {
          console.warn("YouTube Player Error:", e.data);
          setPlay(false); 
        }}
      />
    </div>
  );
}