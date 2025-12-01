'use client';
import ReactPlayer from 'react-player'; 
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';

export default function HiddenPlayer() {
  const { isPlaying, currentIndex, nextTrack, setPlay } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed bottom-0 right-0 opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
      <ReactPlayer
        // ⭐ 關鍵修改：加上 key。
        // 當 currentSong.id 改變時，React 會完全銷毀並重建這個元件。
        // 這會自動重置 internal state，避免 AbortError，也不需要手動處理 onBuffer。
        key={currentSong.youtubeId}

        url={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
        
        // 只有當播放器載入完成 (isReady) 且 全域狀態是播放中 (isPlaying) 時，才真的播放
        playing={isReady && isPlaying}
        
        controls={false}
        volume={1}
        width="100%"
        height="100%"
        
        // 當新歌載入完成，解鎖 isReady
        onReady={() => setIsReady(true)}
        
        onEnded={nextTrack}
        
        // 發生錯誤時 (例如影片被刪除)，自動跳下一首，避免卡住
        onError={(e: any) => {
            console.log('Player error:', e);
            nextTrack();
        }}

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