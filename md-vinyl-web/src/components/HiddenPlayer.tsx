'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';

export default function HiddenPlayer() {
  const { 
    isPlaying, currentIndex, nextTrack, setPlay, volume, isMuted,
    setProgress, isSeeking 
  } = usePlayerStore();
  
  const currentSong = DEMO_PLAYLIST[currentIndex];
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. 核心播放控制
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isPlaying) player.playVideo(); 
      else player.pauseVideo();
    }
  }, [isPlaying, isReady]);

  // 2. 音量控制
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isMuted) player.mute();
      else { player.unMute(); player.setVolume(volume); }
    }
  }, [volume, isMuted, isReady]);

  // 3. 進度更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isReady && !isSeeking) {
      interval = setInterval(() => {
        const player = playerRef.current;
        if (player && typeof player.getCurrentTime === 'function') {
          const current = player.getCurrentTime();
          const total = player.getDuration();
          if (total > 0) {
            const percent = (current / total) * 100;
            setProgress(percent, current, total);
          }
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isReady, isSeeking, setProgress]);

  // 4. Seek 監聽
  useEffect(() => {
    const handleSeek = (e: CustomEvent) => {
        const player = playerRef.current;
        if (player && isReady) {
            const time = (e.detail.percent / 100) * player.getDuration();
            player.seekTo(time, true);
        }
    };
    window.addEventListener('player-seek', handleSeek as EventListener);
    return () => window.removeEventListener('player-seek', handleSeek as EventListener);
  }, [isReady]);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      // ✅ 修正：強制開啟自動播放，這對切換下一首非常重要
      autoplay: 1, 
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
    <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', visibility: 'hidden' }}>
      <YouTube
        videoId={currentSong.youtubeId}
        opts={opts}
        onReady={(e: any) => {
          playerRef.current = e.target;
          setIsReady(true);
          e.target.setVolume(volume);
          if (isMuted) e.target.mute();
          // 如果全域狀態是播放中，就播放
          if (isPlaying) e.target.playVideo();
        }}
        onStateChange={(e: any) => {
          const state = e.data;
          // 0 = Ended -> 下一首
          if (state === 0) {
             nextTrack();
          }
          // ⚠️ 關鍵修復：當影片進入「未開始 (-1)」或「已列隊 (5)」且應該要播放時，強制播放
          if ((state === -1 || state === 5) && isPlaying) {
             e.target.playVideo();
          }
          
          // 同步 UI 狀態
          if (state === 1 && !isPlaying) setPlay(true);
          if (state === 2 && isPlaying) setPlay(false);
        }}
        onError={(e: any) => { 
            console.warn("YouTube Player Error:", e.data); 
            // 遇到嚴重錯誤 (如版權擋) 才停止，不然保持播放狀態嘗試載入
            if(e.data === 150 || e.data === 101) setPlay(false);
        }}
      />
    </div>
  );
}