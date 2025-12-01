'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import VinylView from '@/components/VinylView';
import CoverflowView from '@/components/CoverflowView';
import HiddenPlayer from '@/components/HiddenPlayer';
import { Play, Pause, SkipBack, SkipForward, Disc, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export default function Home() {
  const { 
    viewMode, 
    toggleViewMode, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentIndex 
  } = usePlayerStore();

  const currentSong = DEMO_PLAYLIST[currentIndex];

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-black relative text-white font-sans select-none flex flex-col">
      
      {/* 0. 雜訊紋理層 (增加質感) */}
      <div className="bg-noise" />

      {/* 1. 動態模糊背景 (Atmosphere) */}
      <div className="absolute inset-0 z-0">
         <div 
            key={currentSong.cover} // 加 key 觸發淡入淡出動畫
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-60 blur-[80px] scale-110 animate-pulse-slow"
            style={{ backgroundImage: `url(${currentSong.cover})` }}
         />
         <div className="absolute inset-0 bg-black/40" /> {/* 遮罩讓文字更清晰 */}
      </div>

      {/* 2. 前景內容 */}
      <div className="relative z-10 flex-1 flex flex-col h-full max-w-5xl mx-auto w-full">
        
        {/* 頂部導航 */}
        <header className="px-6 py-6 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] text-white/80">MD VINYL</span>
          </div>
          
          <button 
            onClick={toggleViewMode}
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all active:scale-95"
          >
            {viewMode === 'vinyl' ? <Layers size={14} className="text-white/70" /> : <Disc size={14} className="text-white/70" />}
            <span className="text-xs font-medium text-white/90 group-hover:text-white">
              {viewMode === 'vinyl' ? 'Cover Flow' : 'Vinyl Mode'}
            </span>
          </button>
        </header>

        {/* 中間顯示區 */}
        <div className="flex-1 relative flex items-center justify-center w-full overflow-hidden">
          {viewMode === 'vinyl' ? <VinylView /> : <CoverflowView />}
        </div>

        {/* 底部控制列 (Glassmorphism) */}
        <footer className="w-full px-6 pb-12 pt-6 flex justify-center">
          <div className="flex items-center gap-10 bg-white/10 backdrop-blur-2xl px-12 py-5 rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            
            <button 
                onClick={prevTrack} 
                className="text-white/60 hover:text-white transition-all active:scale-90 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                isPlaying 
                  ? "bg-white/20 text-white border border-white/20 scale-95" 
                  : "bg-white text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              )}
            >
              {isPlaying ? (
                <Pause size={36} fill="currentColor" />
              ) : (
                <Play size={36} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button 
                onClick={nextTrack} 
                className="text-white/60 hover:text-white transition-all active:scale-90 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>
        </footer>
      </div>

      <HiddenPlayer />
    </main>
  );
}