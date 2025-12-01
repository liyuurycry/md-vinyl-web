'use client';
import { motion } from 'framer-motion';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';

export default function VinylView() {
  const { isPlaying, currentIndex } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* 唱機主體 */}
      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
        
        {/* 唱臂結構 (Tone Arm) */}
        <div className="absolute -top-10 -right-4 md:-top-16 md:-right-10 z-20 w-24 h-48 pointer-events-none">
           {/* 軸心 */}
           <div className="absolute top-4 right-4 w-12 h-12 bg-neutral-800 rounded-full border-4 border-neutral-700 shadow-xl z-30" />
           {/* 臂桿 */}
           <motion.div 
             className="w-full h-full origin-[80%_15%]"
             animate={{ rotate: isPlaying ? 30 : 0 }}
             transition={{ type: 'spring', stiffness: 40, damping: 10 }}
           >
              <div className="absolute top-8 right-8 w-2 h-40 md:h-56 bg-gradient-to-b from-neutral-400 to-neutral-600 rounded-full shadow-lg origin-top" style={{ transform: 'rotate(-15deg)' }} />
              <div className="absolute bottom-[20%] left-4 w-10 h-14 bg-neutral-900 rounded-md shadow-md transform rotate-12" />
           </motion.div>
        </div>

        {/* 黑膠唱片 (可旋轉部分) */}
        <motion.div
          className="w-full h-full rounded-full shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] relative flex items-center justify-center"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          {/* 1. 黑膠底色與紋理 */}
          <div className="absolute inset-0 rounded-full bg-[#111] vinyl-grooves border-2 border-[#1a1a1a]" />
          
          {/* 2. 動態反光 (Shine) */}
          <div className="absolute inset-0 rounded-full vinyl-shine opacity-40 mix-blend-overlay" />

          {/* 3. 專輯封面 (Label) */}
          <div className="w-[45%] h-[45%] rounded-full overflow-hidden border-8 border-[#0a0a0a] relative z-10 shadow-inner">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 4. 中心孔 */}
          <div className="absolute w-3 h-3 bg-black rounded-full z-20 border border-neutral-700" />
        </motion.div>
      </div>

      {/* 歌曲資訊 (玻璃擬態) */}
      <div className="mt-12 text-center z-10 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 max-w-[90%] w-full md:w-auto md:min-w-[300px]">
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-1 tracking-tight truncate">
          {currentSong.title}
        </h2>
        <p className="text-base text-white/60 font-medium tracking-wide uppercase">
          {currentSong.artist}
        </p>
      </div>
    </div>
  );
}