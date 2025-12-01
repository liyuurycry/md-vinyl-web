'use client';
import { motion } from 'framer-motion';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';

export default function VinylView() {
  const { isPlaying, currentIndex } = usePlayerStore();
  const currentSong = DEMO_PLAYLIST[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
      {/* 唱機轉盤區域 */}
      <div className="relative w-64 h-64 md:w-96 md:h-96">
        
        {/* 唱臂 (Tone Arm) */}
        <motion.div 
          className="absolute -top-8 -right-8 w-20 h-40 md:w-24 md:h-48 z-20 origin-top-right pointer-events-none"
          animate={{ rotate: isPlaying ? 25 : 0 }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
          <div className="w-1 h-28 md:h-32 bg-gray-400 mx-auto rounded-full shadow-lg" />
          <div className="w-6 h-10 md:w-8 md:h-12 bg-gray-800 mx-auto -mt-2 rounded shadow-xl" />
        </motion.div>

        {/* 黑膠唱片本體 */}
        <motion.div
          className="w-full h-full rounded-full bg-black shadow-2xl relative flex items-center justify-center border-4 border-gray-900"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          style={{ 
            background: 'radial-gradient(circle, #111 0%, #333 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)' 
          }}
        >
          {/* 紋理反光 */}
          <div className="absolute inset-0 rounded-full opacity-30 bg-[conic-gradient(transparent_0deg,white_45deg,transparent_90deg,transparent_180deg,white_225deg,transparent_270deg)] pointer-events-none" />

          {/* 封面圖片 */}
          <div className="w-2/3 h-2/3 rounded-full overflow-hidden border-4 border-black relative z-10">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* 歌曲資訊 */}
      <div className="mt-10 text-center z-10 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md mb-2 line-clamp-1">{currentSong.title}</h2>
        <p className="text-lg text-white/70 font-medium">{currentSong.artist}</p>
      </div>
    </div>
  );
}