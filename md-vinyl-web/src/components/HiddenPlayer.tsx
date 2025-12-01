'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export default function HiddenPlayer() {
  const { isPlaying, currentIndex, nextTrack, setPlay } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  
  const [isClient, setIsClient] = useState(false);
  const [isVideoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 切換歌曲時，先鎖定狀態，避免 AbortError
  useEffect(() => {
    setVideoReady(false);
  }, [currentSong.youtubeId]);

  if (!isClient) return null;

  return (
    <div className="fixed bottom-0 right-0 opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
        
        // 只有當 用戶想播 且 影片已緩衝完畢 才送出播放指令
        playing={isPlaying && isVideoReady}
        
        controls={false}
        muted={false}
        volume={1}
        width="100%"
        height="100%"
        
        onReady={() => setVideoReady(true)}
        onEnded={nextTrack}
        
        onError={(e: any) => {
            console.log('Player error:', e);
        }}

        playsinline={true} 
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0, 
              controls: 0, 
              modestbranding: 1,
              origin: typeof window !== 'undefined' ? window.location.origin : undefined,
              autoplay: 1
            }
          } as any
        }}
      />
    </div>
  );
}