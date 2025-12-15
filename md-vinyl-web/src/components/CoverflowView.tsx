'use client';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';

export default function CoverflowView() {
  const { currentIndex, setTrackIndex, theme, isAiMode } = usePlayerStore();
  const bgRGB = isAiMode ? theme.bgRGB : '255, 255, 255'; // 根據 AI 模式決定倒影顏色

  const total = DEMO_PLAYLIST.length;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center perspective-container">
      {DEMO_PLAYLIST.map((song, index) => {
        
        // ⚠️ 關鍵修正：最短路徑計算 (Circular Loop)
        let offset = index - currentIndex;
        
        // 如果距離太遠 (例如 0 到 4)，代表要繞路
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const isActive = index === currentIndex;
        const rotateY = offset === 0 ? 0 : offset < 0 ? 55 : -55;
        const translateZ = offset === 0 ? 200 : -200 - Math.abs(offset) * 100;
        const translateX = offset === 0 ? 0 : offset * 70;
        
        // Z-Index 邏輯：中間最高，越遠越低
        const zIndex = 100 - Math.abs(offset);
        
        const opacity = isActive ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.4);

        // 超出視野的不渲染，優化效能
        if (Math.abs(offset) > 2) return null;

        return (
          <div
            key={song.id}
            onClick={() => setTrackIndex(index)}
            className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer preserve-3d"
            style={{
              transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
              zIndex: zIndex,
              opacity: opacity,
            }}
          >
            {/* 本體卡片 */}
            <div className="w-full h-full shadow-2xl relative overflow-hidden group border border-white/20 rounded-lg bg-black z-20">
                <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                {!isActive && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] transition-all duration-500" />}
            </div>

            {/* 倒影 (Reflection) */}
            <div 
                className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                style={{ 
                    transformOrigin: 'bottom',
                    transform: 'scaleY(-1) translateY(2px)', 
                    opacity: 0.5,
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)'
                }}
            >
                <img src={song.cover} alt="" className="w-full h-full object-cover rounded-lg blur-[2px]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}