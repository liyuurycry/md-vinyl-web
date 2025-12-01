'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import VinylView from '@/components/VinylView';
import CoverflowView from '@/components/CoverflowView';
import HiddenPlayer from '@/components/HiddenPlayer';
import { Play, Pause, SkipBack, SkipForward, Disc, Layers, Sun, Moon, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { clsx } from 'clsx';

export default function Home() {
  const { 
    viewMode, toggleViewMode, 
    isPlaying, togglePlay, nextTrack, prevTrack, 
    currentIndex, 
    volume, setVolume, isMuted, toggleMute,
    theme, toggleTheme 
  } = usePlayerStore();

  const currentSong = DEMO_PLAYLIST[currentIndex];
  const isDark = theme === 'dark';

  // 顏色變數
  const textColor = isDark ? '#ffffff' : '#171717';
  const bgColor = isDark ? '#000000' : '#ffffff';
  const footerBg = isDark ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  const footerBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  return (
    <main 
      className="relative font-sans select-none flex flex-col transition-colors duration-700 ease-in-out"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      
      {/* 背景層 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div 
            key={currentSong.cover}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-linear scale-125 opacity-20"
            style={{ 
                backgroundImage: `url(${currentSong.cover})`,
                filter: 'blur(100px) saturate(1.5)',
            }}
         />
      </div>

      {/* 1. 主要內容區 */}
      <div className="relative z-30 h-full w-full flex flex-col" style={{ paddingBottom: '120px' }}>
        
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center w-full max-w-[1600px] mx-auto flex-shrink-0">
          <div className="flex items-center gap-3 opacity-90">
            <div className={clsx("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", isPlaying ? "bg-red-500 text-red-500" : "bg-gray-400 text-gray-400")} />
            <span className="text-xs font-bold tracking-[0.3em]">MD VINYL</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
                onClick={toggleViewMode}
                className={clsx(
                    "h-10 px-5 rounded-full flex items-center gap-2 transition-all active:scale-95 font-medium text-xs tracking-wide border",
                    isDark 
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" 
                        : "bg-black/5 border-black/5 hover:bg-black/10 text-black"
                )}
            >
                {viewMode === 'vinyl' ? <Layers size={16} /> : <Disc size={16} />}
                <span>{viewMode === 'vinyl' ? 'COVER FLOW' : 'VINYL'}</span>
            </button>

            <button
                onClick={toggleTheme}
                className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border",
                    isDark 
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400" 
                        : "bg-black/5 border-black/5 hover:bg-black/10 text-slate-600"
                )}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 relative flex items-center justify-center w-full overflow-hidden">
          {viewMode === 'vinyl' ? <VinylView /> : <CoverflowView />}
        </div>
      </div>

      {/* 2. 底部播放列 */}
      <footer 
        className="backdrop-blur-2xl flex items-center justify-between transition-colors duration-500"
        style={{
            position: 'fixed', 
            bottom: 0,
            left: 0,
            width: '100%',
            height: '96px',
            zIndex: 9999,
            paddingLeft: '2rem',
            paddingRight: '2rem',
            borderTop: `1px solid ${footerBorder}`,
            backgroundColor: footerBg,
            color: textColor 
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between h-full">
            
            {/* 左側：歌曲資訊 (縮圖尺寸鎖定) */}
            <div className="flex items-center gap-4 w-[30%] min-w-0 group cursor-pointer h-full">
                <div 
                    className={clsx(
                        "rounded-lg overflow-hidden shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-white/10",
                        isDark ? "bg-[#222]" : "bg-[#eee]"
                    )}
                    style={{
                        width: '56px',  // ⚠️ 強制寬度
                        height: '56px', // ⚠️ 強制高度
                    }}
                >
                    <img 
                        src={currentSong.cover} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        alt="cover" 
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <h3 className="text-base font-bold truncate pr-4 leading-tight mb-0.5">{currentSong.title}</h3>
                    <p className="text-xs opacity-60 truncate pr-4 font-medium tracking-wide uppercase">{currentSong.artist}</p>
                </div>
            </div>

            {/* 中間：播放控制 (對齊修復) */}
            <div 
                className="flex items-center gap-8 h-full"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <button 
                    onClick={prevTrack} 
                    className={clsx(
                        "w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90",
                        isDark ? "hover:bg-white/10 text-gray-300 hover:text-white" : "hover:bg-black/5 text-gray-600 hover:text-black"
                    )}
                >
                    <SkipBack size={28} fill="currentColor" />
                </button>

                <button 
                    onClick={togglePlay}
                    className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 active:shadow-inner",
                        isDark
                            ? "bg-white text-black hover:bg-gray-100" 
                            : "bg-black text-white hover:bg-gray-900"
                    )}
                >
                    {isPlaying ? (
                        <Pause size={32} fill="currentColor" />
                    ) : (
                        <Play size={32} fill="currentColor" className="ml-1" />
                    )}
                </button>

                <button 
                    onClick={nextTrack} 
                    className={clsx(
                        "w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90",
                        isDark ? "hover:bg-white/10 text-gray-300 hover:text-white" : "hover:bg-black/5 text-gray-600 hover:text-black"
                    )}
                >
                    <SkipForward size={28} fill="currentColor" />
                </button>
            </div>

            {/* 右側：音量控制 */}
            <div className="flex items-center justify-end gap-3 w-[30%] h-full">
                <button 
                    onClick={toggleMute} 
                    className={clsx(
                        "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90",
                        isDark ? "hover:bg-white/10" : "hover:bg-black/5"
                    )}
                >
                    {isMuted || volume === 0 ? <VolumeX size={22} /> : volume < 50 ? <Volume1 size={22} /> : <Volume2 size={22} />}
                </button>
                
                <div className="group relative w-28 h-8 flex items-center cursor-pointer">
                    <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className={clsx(
                        "w-full h-1.5 rounded-full overflow-hidden relative z-10 pointer-events-none transition-colors",
                        isDark ? "bg-white/20" : "bg-black/10"
                    )}>
                        <div 
                            className="h-full rounded-full transition-all duration-100 ease-out bg-current"
                            style={{ width: `${isMuted ? 0 : volume}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </footer>

      <HiddenPlayer />
    </main>
  );
}