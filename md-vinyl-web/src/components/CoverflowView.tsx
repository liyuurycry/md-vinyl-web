'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function CoverflowView() {
  const { currentIndex, setTrackIndex } = usePlayerStore();

  return (
    <div className="h-full w-full flex items-center justify-center py-4">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={currentIndex}
        onSlideChange={(swiper) => setTrackIndex(swiper.activeIndex)}
        coverflowEffect={{
          rotate: 35,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        mousewheel={true}
        modules={[EffectCoverflow, Mousewheel]}
        className="w-full h-[400px] md:h-[500px]"
      >
        {DEMO_PLAYLIST.map((song) => (
          <SwiperSlide 
            key={song.id} 
            className="!w-[280px] !h-[280px] md:!w-[380px] md:!h-[380px] rounded-xl overflow-visible"
          >
            {/* 封面本體 */}
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black relative z-10 group">
                <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* 倒影效果 */}
            <div 
                className="absolute top-full left-0 w-full h-full mt-2 opacity-50 scale-y-[-1] pointer-events-none blur-[2px]" 
                style={{ 
                   backgroundImage: `url(${song.cover})`, 
                   backgroundSize: 'cover',
                   maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)',
                   WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)'
                }} 
            />
            
            {/* 卡片下方的文字 (僅在 Coverflow 模式顯示) */}
            <div className="absolute -bottom-24 left-0 w-full text-center opacity-0 transition-opacity duration-300 swiper-slide-active:opacity-100">
                <h3 className="text-xl font-bold text-white drop-shadow-md">{song.title}</h3>
                <p className="text-sm text-white/60">{song.artist}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}