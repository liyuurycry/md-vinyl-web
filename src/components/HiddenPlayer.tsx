'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';

export default function HiddenPlayer() {
  const { 
    isPlaying, currentIndex, nextTrack, prevTrack, setTrackIndex, setPlay, volume, isMuted,
    setProgress, isSeeking 
  } = usePlayerStore();
  
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. 準備歌單 ID 字串 (格式: "id1,id2,id3")
  // 這樣做可以啟動 YouTube 原生歌單模式，背景播放不斷線
  const playlistIds = DEMO_PLAYLIST.map(song => song.youtubeId).join(',');
  const currentSong = DEMO_PLAYLIST[currentIndex];

  // --------------------------------------------------------
  // A. 來自 UI 的指令控制 (UI -> YouTube)
  // --------------------------------------------------------
  
  // 1. 切換歌曲 (使用 playVideoAt)
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      // 只有當「播放器目前的歌」跟「UI 顯示的歌」不一致時，才執行切換
      // 這能防止 "YouTube 自動換歌 -> 更新 UI -> UI 又命令 YouTube 重播" 的迴圈
      const internalIndex = player.getPlaylistIndex();
      if (internalIndex !== currentIndex) {
          player.playVideoAt(currentIndex);
      }
    }
  }, [currentIndex, isReady]);

  // 2. 播放/暫停
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isPlaying) player.playVideo();
      else player.pauseVideo();
    }
  }, [isPlaying, isReady]);

  // 3. 音量
  useEffect(() => {
    const player = playerRef.current;
    if (player && isReady) {
      if (isMuted) player.mute();
      else {
        player.unMute();
        player.setVolume(volume);
      }
    }
  }, [volume, isMuted, isReady]);

  // --------------------------------------------------------
  // B. 狀態監聽與同步 (YouTube -> UI)
  // --------------------------------------------------------

  // 4. 進度條同步 (Polling)
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

  // 5. Media Session API (讓手機鎖定畫面能控制)
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        artwork: [
          { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      // 綁定控制中心按鈕
      navigator.mediaSession.setActionHandler('play', () => setPlay(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlay(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => {
         // UI 計算上一首 Index -> Store 更新 -> 觸發上面 playVideoAt
         const newIndex = (currentIndex - 1 + DEMO_PLAYLIST.length) % DEMO_PLAYLIST.length;
         setTrackIndex(newIndex);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
         const newIndex = (currentIndex + 1) % DEMO_PLAYLIST.length;
         setTrackIndex(newIndex);
      });
    }
  }, [currentIndex]); // 每次換歌都要更新 Metadata

  // 6. 監聽拖曳進度條 (Seek)
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


  // --------------------------------------------------------
  // C. 播放器設定
  // --------------------------------------------------------
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1, // 必開
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      playsinline: 1, 
      
      // ⚠️ 關鍵：啟用 Playlist 模式
      listType: 'playlist',
      playlist: playlistIds, // 傳入所有 ID
      loop: 1, // 允許循環播放
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  };

  return (
    <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', visibility: 'hidden' }}>
      <YouTube
        // ⚠️ 移除 videoId 屬性，改用 opts.playlist 控制
        // 這樣 React 就不會因為 ID 改變而銷毀播放器，保持同一個 Session
        opts={opts}
        
        onReady={(e: any) => {
          console.log("✅ YouTube Playlist Player Ready");
          playerRef.current = e.target;
          setIsReady(true);
          
          e.target.setVolume(volume);
          if (isMuted) e.target.mute();
          
          // 初始化：播放指定的那一首 (因為 loadPlaylist 預設從第一首開始)
          e.target.playVideoAt(currentIndex);
          
          if (!isPlaying) {
             e.target.pauseVideo();
          }
        }}

        onStateChange={(e: any) => {
          const state = e.data;
          
          // 狀態對應：-1(未開始), 0(結束), 1(播放), 2(暫停), 3(緩衝), 5(列隊)
          
          // 當進入播放狀態 (1) 或 緩衝 (3) 時，檢查 YouTube 播到哪一首了
          // 這是為了捕捉「YouTube 自動播下一首」的情況
          if (state === 1 || state === 3) {
             const ytIndex = e.target.getPlaylistIndex();
             // 如果 YouTube 已經播到下一首，但 UI 還沒變，就更新 UI
             if (ytIndex !== -1 && ytIndex !== currentIndex) {
                 console.log("🔄 Syncing UI with YouTube Auto-Play:", ytIndex);
                 setTrackIndex(ytIndex);
             }
             if (!isPlaying) setPlay(true);
          }

          if (state === 2 && isPlaying) setPlay(false);
          
          // 如果發生錯誤或無法播放，嘗試強制播放
          if (state === 5 && isPlaying) {
             e.target.playVideo();
          }
        }}
        
        onError={(e: any) => { 
            console.warn("YouTube Player Error:", e.data); 
            // 如果遇到版權影片 (150)，自動跳下一首
            if(e.data === 150 || e.data === 101) {
                const next = (currentIndex + 1) % DEMO_PLAYLIST.length;
                setTrackIndex(next);
            }
        }}
      />
    </div>
  );
}