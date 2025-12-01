'use client';
import ReactPlayer from 'react-player'; // 改回標準引入
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';

export default function HiddenPlayer() {
  const { isPlaying, currentIndex, nextTrack, setPlay } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  const [isClient, setIsClient] = useState(false);

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
        playsinline={true} 
        config={{
          youtube: {
            playerVars: { showinfo: 0, controls: 0, modestbranding: 1 }
          } as any
        }}
      />
    </div>
  );
}