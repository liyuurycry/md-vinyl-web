'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Mousewheel } from 'swiper/modules';
import { usePlayerStore, DEMO_PLAYLIST } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function CoverflowView() {
  const { currentIndex, setTrackIndex } = usePlayerStore();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // 監聽 currentIndex 變化 -> 控制 Swiper 滑動
  // 這樣當你按底下的「下一首」按鈕時，上面的封面才會跟著動
  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== currentIndex) {
      swiperInstance.slideTo(currentIndex);
    }
  }, [currentIndex, swiperInstance]);

  return (
    <div className="h-full w-full flex items-center justify-center py-4">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={currentIndex}
        // 抓取 Swiper 實體
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        // 當使用者手動滑動時，同步更新全域狀態
        onSlideChange={(swiper) => setTrackIndex(swiper.activeIndex)}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: true,
        }}
        mousewheel={true}
        modules={[EffectCoverflow, Mousewheel]}
        className="w-full h-[350px] md:h-[500px]"
      >
        {DEMO_PLAYLIST.map((song) => (
          <SwiperSlide 
            key={song.id} 
            className="!w-[260px] !h-[260px] md:!w-[400px] md:!h-[400px] rounded-xl overflow-visible"
          >
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black relative z-10">
                <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover block"
                draggable={false}
                />
            </div>
            {/* 倒影 */}
            <div 
                className="absolute top-full left-0 w-full h-full mt-2 opacity-30 scale-y-[-1] pointer-events-none blur-[1px]" 
                style={{ 
                   backgroundImage: `url(${song.cover})`, 
                   backgroundSize: 'cover',
                   maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)',
                   WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)'
                }} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}