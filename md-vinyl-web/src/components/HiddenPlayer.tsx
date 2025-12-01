'use client';
import ReactPlayer from 'react-player/youtube';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';

export default function HiddenPlayer() {
  const { isPlaying, currentIndex, nextTrack, setPlay } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  const [isClient, setIsClient] = useState(false);

  // 確保只在客戶端渲染，避免 Next.js 報錯
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed bottom-0 right-0 opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
        playing={isPlaying}
        controls={false}
        volume={1}
        width="100%"
        height="100%"
        onEnded={nextTrack}
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
        // iOS 需要 playsinline 才能在背景播放 (雖然有時候還是會被擋)
        playsinline={true} 
        config={{
          youtube: {
            playerVars: { showinfo: 0, controls: 0, modestbranding: 1 }
          }
        }}
      />
    </div>
  );
}