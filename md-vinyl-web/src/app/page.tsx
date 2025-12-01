'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import VinylView from '@/components/VinylView';
import CoverflowView from '@/components/CoverflowView';
import HiddenPlayer from '@/components/HiddenPlayer';
import { Play, Pause, SkipBack, SkipForward, Disc, Layers } from 'lucide-react';

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
    <main className="h-[100dvh] w-screen overflow-hidden bg-gray-900 relative text-white font-sans select-none">
      
      {/* 1. 動態模糊背景 */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${currentSong.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px) brightness(0.4) saturate(1.2)',
          transform: 'scale(1.2)'
        }}
      />

      {/* 2. 主要內容區域 */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* 頂部導航 */}
        <header className="p-4 md:p-6 flex justify-between items-center w-full bg-gradient-to-b from-black/20 to-transparent">
          <div className="text-xs md:text-sm font-bold tracking-widest text-white/50">MD VINYL</div>
          <button 
            onClick={toggleViewMode}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all text-xs md:text-sm font-medium border border-white/5"
          >
            {viewMode === 'vinyl' ? <Layers size={14} /> : <Disc size={14} />}
            <span>{viewMode === 'vinyl' ? 'Cover Flow' : 'Vinyl'}</span>
          </button>
        </header>

        {/* 中間顯示區 */}
        <div className="flex-1 overflow-hidden relative flex flex-col justify-center">
          {viewMode === 'vinyl' ? <VinylView /> : <CoverflowView />}
        </div>

        {/* 底部控制列 */}
        <footer className="p-6 pb-10 w-full flex justify-center items-center bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-center gap-6 md:gap-8 bg-black/40 backdrop-blur-xl px-8 py-3 md:px-10 md:py-4 rounded-full border border-white/10 shadow-2xl">
            <button onClick={prevTrack} className="text-white/70 hover:text-white transition-colors active:scale-90">
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-14 h-14 md:w-16 md:h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button onClick={nextTrack} className="text-white/70 hover:text-white transition-colors active:scale-90">
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </footer>
      </div>

      <HiddenPlayer />
    </main>
  );
}