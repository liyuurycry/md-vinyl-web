'use client';
import { motion } from 'framer-motion';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { clsx } from 'clsx';

export default function VinylView() {
  const { isPlaying, currentIndex, theme } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
      {/* 
         容器尺寸控制：
         使用 vmin (Viewport Minimum) 確保在直式/橫式螢幕都保持正方形且不超出
      */}
      <div 
        className="relative aspect-square transition-all duration-500"
        style={{
            // 限制最大寬度為螢幕寬度的 80% 或高度的 60%
            width: 'min(80vw, 60vh)',
            maxWidth: '600px',
        }}
      >
        
        {/* 唱臂 (Tone Arm) */}
        <div className="absolute -top-[15%] -right-[5%] z-20 w-[25%] h-[50%] pointer-events-none drop-shadow-2xl">
           <div className={clsx(
             "absolute top-[18%] right-[18%] w-[28%] h-[28%] rounded-full border-[3px] shadow-xl z-30 transition-colors duration-500",
             isDark ? "bg-[#222] border-[#333]" : "bg-[#e5e5e5] border-[#d4d4d4]"
           )} />
           
           <motion.div 
             className="w-full h-full origin-[75%_32%]"
             animate={{ rotate: isPlaying ? 30 : 0 }}
             transition={{ type: 'spring', stiffness: 30, damping: 12 }}
           >
              <div className={clsx(
                "absolute top-[25%] right-[25%] w-[6%] h-[80%] rounded-full shadow-lg origin-top transition-colors duration-500",
                isDark ? "bg-gradient-to-b from-[#666] to-[#444]" : "bg-gradient-to-b from-[#ccc] to-[#999]"
              )} style={{ transform: 'rotate(-15deg)' }} />
              
              <div className={clsx(
                "absolute bottom-[2%] left-[10%] w-[22%] h-[14%] rounded-sm shadow-md transform rotate-12 transition-colors duration-500",
                isDark ? "bg-[#111]" : "bg-[#333]"
              )} />
           </motion.div>
        </div>

        {/* 黑膠唱片 (旋轉層) */}
        <motion.div
          className={clsx(
            "w-full h-full rounded-full relative transition-all duration-500",
            isDark 
              ? "shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/5" 
              : "shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-black/5"
          )}
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          {/* 1. 黑膠底色 */}
          <div className={clsx(
            "absolute inset-0 rounded-full border-[4px] vinyl-grooves",
            isDark ? "bg-[#121212] border-[#222]" : "bg-[#1a1a1a] border-[#333]"
          )} />
          
          {/* 2. 動態反光 */}
          <div className="absolute inset-0 rounded-full vinyl-shine opacity-40 mix-blend-overlay pointer-events-none" />

          {/* 3. 專輯封面 (Label) - ⚠️ 強制修正區 */}
          <div 
            className="absolute rounded-full overflow-hidden border-[4px] z-10 shadow-inner"
            style={{
                // 使用絕對居中 + 固定百分比大小
                // 這樣不管父層多大，圖片永遠是父層的 44%
                width: '44%',
                height: '44%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: isDark ? '#0a0a0a' : '#111',
                backgroundColor: '#000'
            }}
          >
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover block"
              draggable={false}
            />
          </div>
          
          {/* 4. 中心孔 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] h-[3%] bg-[#050505] rounded-full z-20" />
        </motion.div>
      </div>
    </div>
  );
}