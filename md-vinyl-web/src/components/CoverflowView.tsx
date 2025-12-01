'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function CoverflowView() {
  const { currentIndex, setTrackIndex } = usePlayerStore();

  return (
    <div className="h-full w-full flex items-center justify-center py-10">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={currentIndex}
        onSlideChange={(swiper) => setTrackIndex(swiper.activeIndex)}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        mousewheel={true}
        modules={[EffectCoverflow, Mousewheel]}
        className="w-full max-w-4xl !pt-4 !pb-10"
      >
        {DEMO_PLAYLIST.map((song) => (
          <SwiperSlide 
            key={song.id} 
            className="!w-60 !h-60 md:!w-80 md:!h-80 rounded-xl overflow-hidden shadow-2xl bg-black"
          >
            <img 
              src={song.cover} 
              alt={song.title} 
              className="w-full h-full object-cover block"
            />
            {/* 倒影效果 */}
            <div className="absolute top-full left-0 w-full h-full mt-2 opacity-40 scale-y-[-1]" 
                 style={{ 
                   backgroundImage: `url(${song.cover})`, 
                   backgroundSize: 'cover',
                   WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
                 }} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}