'use client';
import { motion } from 'framer-motion';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { clsx } from 'clsx';

export default function VinylView() {
  const { isPlaying, currentIndex, theme } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  // 唱臂依然隨主題變色，但黑膠本體強制為黑色
  const isDark = theme.isDark;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
      <div 
        className="relative aspect-square transition-all duration-700 ease-out"
        style={{
            width: 'min(90vw, 70vh)', 
            height: 'min(90vw, 70vh)',
            maxWidth: '800px',
            maxHeight: '800px'
        }}
      >
        
        {/* 唱臂 (Tone Arm) */}
        <div className="absolute -top-[12%] -right-[8%] z-30 w-[30%] h-[50%] pointer-events-none">
           {/* 基座 */}
           <div className={clsx(
             "absolute top-[15%] right-[15%] w-[22%] h-[22%] rounded-full shadow-2xl z-20 flex items-center justify-center border-[2px]",
             isDark 
                ? "bg-[#1f1f1f] border-[#333]" 
                : "bg-[#f0f0f0] border-[#dcdcdc]"
           )}>
              <div className={clsx("w-[40%] h-[40%] rounded-full shadow-inner", isDark ? "bg-[#111]" : "bg-[#ccc]")} />
           </div>
           
           {/* 臂桿動畫 */}
           <motion.div 
             className="w-full h-full origin-[73%_26%]" 
             animate={{ rotate: isPlaying ? 35 : 0 }}
             transition={{ type: 'spring', stiffness: 40, damping: 15, mass: 1.2 }}
           >
              {/* 長桿 */}
              <div className={clsx(
                "absolute top-[20%] right-[20%] w-[5%] h-[80%] rounded-full shadow-lg origin-top",
                isDark 
                    ? "bg-gradient-to-l from-[#333] via-[#555] to-[#333]" 
                    : "bg-gradient-to-l from-[#bbb] via-[#ddd] to-[#bbb]"
              )} style={{ transform: 'rotate(-18deg)' }} />
              
              {/* 唱頭 */}
              <div className={clsx(
                "absolute bottom-[8%] left-[12%] w-[18%] h-[12%] rounded-[4px] shadow-md transform rotate-[10deg]",
                isDark 
                    ? "bg-[#111] border border-[#333]" 
                    : "bg-[#222] border border-[#444]"
              )}>
                 <div className="absolute -bottom-1 left-1/2 w-1 h-2 bg-gray-400" />
              </div>
           </motion.div>
        </div>

        {/* === 黑膠本體 (Vinyl) === */}
        <motion.div
          className={clsx(
            "w-full h-full rounded-full relative flex items-center justify-center transition-all duration-700",
            // 陰影：亮色模式下有明顯黑影，暗色模式下有微光
            isDark 
              ? "shadow-[0_20px_70px_-10px_rgba(0,0,0,0.8)] border border-white/5" 
              : "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)] border border-black/5"
          )}
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        >
          {/* 1. 物理溝槽紋理 - 強制黑色 */}
          <div className="absolute inset-0 rounded-full vinyl-texture" />
          
          {/* 2. 動態光澤 (Shine) */}
          <div className="absolute inset-0 rounded-full vinyl-shine opacity-50 pointer-events-none" />

          {/* 3. 專輯封面 (Label) */}
          <div 
            className="absolute rounded-full overflow-hidden z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            style={{
                top: '32%',    
                bottom: '32%',
                left: '32%',
                right: '32%',
            }}
          >
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
          
          {/* ⚠️ 確認：此處已無任何中心黑點 div */}
          
        </motion.div>
      </div>
    </div>
  );
}