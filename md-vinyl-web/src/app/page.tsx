'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import VinylView from '@/components/VinylView';
import CoverflowView from '@/components/CoverflowView';
import HiddenPlayer from '@/components/HiddenPlayer';
import { Play, Pause, SkipBack, SkipForward, Disc, Layers, Sun, Moon, Volume2, VolumeX, ListMusic, Loader2, X, Palette, Settings, Key, Check, Copy, Sparkles, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const { 
    viewMode, toggleViewMode, isPlaying, togglePlay, nextTrack, prevTrack, setTrackIndex,
    currentIndex, volume, setVolume, isMuted, toggleMute,
    theme, setTheme, playlist, setPlaylist, groqApiKey, setGroqApiKey,
    isAiMode, toggleAiMode, toggleTheme, progress, setIsSeeking, setProgress
  } = usePlayerStore();

  const currentSong = DEMO_PLAYLIST[currentIndex];
  const isDark = theme.isDark;

  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(groqApiKey);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success' | 'error'} | null>(null);

  const aiTextColor = theme.text;
  const aiBgColor = `rgb(${theme.bgRGB})`;
  const islandBg = isDark ? 'rgba(20, 20, 20, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  const islandBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  useEffect(() => { setTempKey(groqApiKey); }, [groqApiKey]);

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const callGroqProxy = async (prompt: string) => {
    if (!groqApiKey) { 
        setShowSettings(true); 
        throw new Error("NO_KEY"); 
    }
    showToast("AI 正在思考中...", 'info');
    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-groq-api-key': groqApiKey },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API Failed");
    showToast("AI 更新完成 ✨", 'success');
    return data.content;
  };

  // ✅ 修正：恢復正常的 Prompt 邏輯
  const fetchAiAmbience = useCallback(async () => {
    if (isThemeLoading) return;
    setIsThemeLoading(true);
    
    // 根據目前的 isDark 狀態，要求 AI 生成對應亮度的主題
    const modeText = isDark ? "Dark/Night Mode" : "Light/Day Mode";
    
    const prompt = `
        Analyze "${currentSong.title}" by "${currentSong.artist}". 
        Generate a minimalist ${modeText} UI color palette. 
        Return JSON keys: bgRGB(R,G,B), text(hex), secondary(hex), accent(hex), isDark(boolean - should be ${isDark}).
    `;
    
    try {
        const json = await callGroqProxy(prompt);
        if (json) setTheme(JSON.parse(json));
    } catch (e: any) { 
        if(e.message !== "NO_KEY") showToast("AI 生成失敗", 'error');
    } finally { setIsThemeLoading(false); }
  }, [currentSong, isDark, groqApiKey]);

  // 自動化邏輯
  useEffect(() => {
    if (isAiMode) fetchAiAmbience();
    if (showPlaylist) {
        setPlaylist([]);
        fetchAiPlaylist();
    }
  }, [currentSong.id]); 

  // 日夜切換時重算
  useEffect(() => {
    if (isAiMode && !isThemeLoading) {
        fetchAiAmbience();
    }
  }, [isDark]);

  const handleToggleAi = async () => {
    toggleAiMode();
    if (!isAiMode) await fetchAiAmbience();
  };

  const fetchAiPlaylist = async () => {
    if (playlist.length > 0 && (playlist as any)[0]?._sourceId === currentSong.id) return;
    setIsPlaylistLoading(true);
    const prompt = `Recommend 5 songs similar to "${currentSong.title}" by "${currentSong.artist}". Return JSON with "songs": [{title, artist}]. Important: If Chinese, use Traditional Chinese.`;
    try {
        const json = await callGroqProxy(prompt);
        if (json) {
            const parsed = JSON.parse(json);
            setPlaylist(parsed.songs.map((s: any) => ({ ...s, _sourceId: currentSong.id })));
        }
    } catch (e: any) { if(e.message !== "NO_KEY") showToast("歌單生成失敗", 'error'); } finally { setIsPlaylistLoading(false); }
  };

  const handleCopySong = (song: any, index: number) => {
    const text = `${song.title} - ${song.artist}`;
    navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        showToast(`已複製: ${text}`, 'success');
        setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val, 0, 0); 
    const event = new CustomEvent('player-seek', { detail: { percent: val } });
    window.dispatchEvent(event);
  };

  const handleSaveKey = () => {
    setGroqApiKey(tempKey);
    setShowSettings(false);
    showToast("API Key 已儲存", 'success');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden font-sans select-none flex flex-col transition-colors duration-[1500ms] ease-out" style={{ backgroundColor: aiBgColor, color: aiTextColor }}>
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div key={currentSong.cover} className={clsx("absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-linear", isAiMode && isPlaying ? "animate-breathe" : "scale-110")} style={{ backgroundImage: `url(${currentSong.cover})`, filter: 'blur(100px) saturate(1.2)', opacity: isAiMode ? 0.4 : 0.15 }} />
         <div className="absolute inset-0" style={{ background: isDark ? `radial-gradient(circle, transparent 20%, ${aiBgColor} 100%)` : `radial-gradient(circle, transparent 20%, ${aiBgColor} 100%)` }} />
      </div>

      <AnimatePresence>
        {notification && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-32 right-6 z-[100] px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3" style={{ backgroundColor: isDark ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: aiTextColor }}>
                {notification.type === 'info' && <Loader2 size={16} className="animate-spin text-blue-400" />}
                {notification.type === 'success' && <Sparkles size={16} className="text-yellow-400" />}
                {notification.type === 'error' && <X size={16} className="text-red-400" />}
                <span className="text-xs font-bold tracking-wide">{notification.message}</span>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/20 bg-[#1a1a1a] text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2"><Key size={18} className="text-yellow-400" /><h3 className="font-bold text-sm tracking-wide">GROQ API KEY</h3></div>
                        <button onClick={() => setShowSettings(false)}><X size={18} className="opacity-50 hover:opacity-100"/></button>
                    </div>
                    <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="Paste Groq API Key..." className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-400/50 mb-6" />
                    <button onClick={handleSaveKey} className="w-full bg-white text-black font-bold py-3 rounded-lg text-sm hover:bg-gray-200 flex items-center justify-center gap-2"><Check size={16} /> Save</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className={clsx("absolute z-40 w-72 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right", showPlaylist ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none')} style={{ position: 'absolute', top: '80px', right: '24px' }}>
         <div className="backdrop-blur-2xl border shadow-2xl rounded-2xl overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)', borderColor: islandBorder, color: aiTextColor }}>
            <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: islandBorder }}>
                <div className="flex items-center gap-2"><ListMusic size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">AI Picks</span></div>
                <button onClick={() => setShowPlaylist(false)} className="opacity-40 hover:opacity-100"><X size={16}/></button>
            </div>
            <div className="p-2">
                {isPlaylistLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-60"><Loader2 className="animate-spin" size={24} /><span className="text-xs font-medium">Thinking...</span></div>
                ) : (
                    <ul className="space-y-1">
                        {playlist.map((song, idx) => (
                            <li key={idx} onClick={() => handleCopySong(song, idx)} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-current hover:bg-opacity-10 active:scale-95" title="Click to Copy">
                                <span className="text-xs font-mono opacity-30 w-4 flex justify-center">{copiedIndex === idx ? <Check size={12} className="text-green-400" /> : `0${idx + 1}`}</span>
                                <div className="flex-1 min-w-0 flex flex-col gap-0.5"><span className="text-sm font-medium truncate">{song.title}</span><span className="text-[10px] font-bold uppercase tracking-wider opacity-50 truncate">{song.artist}</span></div>
                                <Copy size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
         </div>
      </div>

      <header className="relative z-30 px-6 py-6 flex justify-between items-center w-full max-w-[1600px] mx-auto">
          <div className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors", isDark ? "bg-white/5" : "bg-white/40")}>
            <div className={clsx("w-1.5 h-1.5 rounded-full transition-all duration-500", isPlaying ? "bg-red-500 animate-pulse" : "bg-current opacity-30")} />
            <span className="text-[10px] font-bold tracking-[0.2em] opacity-80">MD VINYL</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleViewMode} className={clsx("p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95", isDark ? "bg-white/5 hover:bg-white/10" : "bg-white/40 hover:bg-white/60")} title="Switch View">{viewMode === 'vinyl' ? <Layers size={18} strokeWidth={1.5} /> : <Disc size={18} strokeWidth={1.5} />}</button>
            
            <button 
                onClick={handleToggleAi} 
                className={clsx("p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 border", isAiMode ? "bg-white/10 border-white/20 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]" : isDark ? "bg-white/5 border-transparent hover:bg-white/10 text-gray-400" : "bg-white/40 border-transparent text-gray-500")} 
                title="Toggle AI Ambience"
            >
                {isThemeLoading ? <Loader2 size={18} className="animate-spin"/> : <Palette size={18} strokeWidth={1.5} />}
            </button>

            {/* ⚠️ 切換按鈕：現在這是一個標準的日夜切換，或者 AI 重新生成 */}
            <button 
                onClick={toggleTheme} 
                className={clsx("p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95", isDark ? "bg-white/5 hover:bg-white/10" : "bg-white/40 hover:bg-white/60")} 
                title={isAiMode ? "Regenerate AI Theme (Switch Mode)" : "Toggle Theme"}
            >
                {isAiMode ? <RefreshCw size={18} strokeWidth={1.5} className={clsx(isThemeLoading && "animate-spin")} /> : (isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />)}
            </button>

            <button onClick={() => { setShowPlaylist(!showPlaylist); if (!showPlaylist) fetchAiPlaylist(); }} className={clsx("p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95", isDark ? "bg-white/5 hover:bg-white/10" : "bg-white/40 hover:bg-white/60")} style={{ color: showPlaylist ? theme.accent : 'currentColor' }} title="AI Recommendations">{isPlaylistLoading ? <Loader2 size={18} className="animate-spin"/> : <ListMusic size={18} strokeWidth={1.5} />}</button>
            <button onClick={() => setShowSettings(true)} className={clsx("p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95", isDark ? "bg-white/5 hover:bg-white/10" : "bg-white/40 hover:bg-white/60")} style={{ color: !groqApiKey ? '#ef4444' : 'currentColor' }} title="Settings"><Settings size={18} strokeWidth={1.5} /></button>
          </div>
      </header>

      <div className="flex-1 relative z-10 flex items-center justify-center w-full overflow-hidden pb-32">
          {viewMode === 'vinyl' ? <VinylView /> : <CoverflowView />}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6 md:pb-8 pointer-events-none">
        <footer className="pointer-events-auto backdrop-blur-3xl rounded-[2.5rem] transition-all duration-500 ease-out shadow-2xl relative overflow-visible" style={{ width: 'min(92%, 700px)', height: '84px', border: `1px solid ${islandBorder}`, backgroundColor: islandBg, color: aiTextColor }}>
            <div className="absolute -top-[1px] left-0 w-full h-[3px] bg-transparent overflow-visible group cursor-pointer" style={{ padding: '4px 0' }}>
                <input type="range" min={0} max={100} step={0.1} value={progress} onChange={handleSeek} onMouseDown={() => setIsSeeking(true)} onMouseUp={() => setIsSeeking(false)} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                <div className="absolute top-[4px] left-[24px] right-[24px] h-[2px] bg-gray-500/20 rounded-full overflow-hidden pointer-events-none">
                    <div className="h-full transition-all duration-200 ease-linear" style={{ width: `${progress}%`, backgroundColor: isAiMode ? theme.accent : (isDark ? '#fff' : '#000') }} />
                </div>
                <div className="absolute top-[3px] h-3 w-3 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-md" style={{ left: `calc(24px + (100% - 48px) * ${progress / 100})`, transform: 'translate(-50%, 0)', backgroundColor: isAiMode ? theme.accent : (isDark ? '#fff' : '#000') }} />
            </div>

            <div className="w-full h-full grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-8 gap-4">
                <div className="flex flex-col justify-center min-w-0 overflow-hidden">
                    <AnimatePresence mode='wait'><motion.h3 key={currentSong.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className="text-base md:text-lg font-medium tracking-tight truncate">{currentSong.title}</motion.h3></AnimatePresence>
                    <motion.p key={currentSong.artist} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase truncate mt-0.5">{currentSong.artist}</motion.p>
                </div>
                <div className="flex items-center gap-5 md:gap-6">
                    <button onClick={prevTrack} className="hidden md:block opacity-40 hover:opacity-100 transition-opacity active:scale-90"><SkipBack size={22} strokeWidth={1.5} /></button>
                    <button onClick={togglePlay} className={clsx("w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg", isDark ? "bg-white text-black hover:shadow-white/20" : "bg-black text-white hover:shadow-black/20")}>{isPlaying ? <Pause size={20} fill="currentColor" strokeWidth={0} /> : <Play size={20} fill="currentColor" strokeWidth={0} className="ml-0.5" />}</button>
                    <button onClick={nextTrack} className="opacity-40 hover:opacity-100 transition-opacity active:scale-90"><SkipForward size={22} strokeWidth={1.5} className="md:hidden" /><SkipForward size={22} strokeWidth={1.5} className="hidden md:block" /></button>
                </div>
                <div className="flex items-center justify-end">
                    <div className="hidden md:flex items-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <button onClick={toggleMute} className="opacity-50">{isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
                        <div className="relative w-20 h-6 flex items-center cursor-pointer group">
                            <input type="range" min={0} max={100} value={isMuted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                            <div className={clsx("w-full h-[2px] rounded-full relative z-10 pointer-events-none", isDark ? "bg-white/20" : "bg-black/10")}><div className="h-full rounded-full bg-current transition-all" style={{ width: `${isMuted ? 0 : volume}%` }} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
      </div>
      <HiddenPlayer />
    </main>
  );
}