import { create } from 'zustand';

// 寫死的 5 首熱門歌曲
export const DEMO_PLAYLIST = [
  {
    id: '1',
    title: 'Plastic Love',
    artist: 'Mariya Takeuchi',
    cover: 'https://i.ytimg.com/vi/3bNITQR4Uso/maxresdefault.jpg',
    youtubeId: '3bNITQR4Uso',
  },
  {
    id: '2',
    title: 'Starboy',
    artist: 'The Weeknd',
    cover: 'https://i.ytimg.com/vi/34Na4j8AVgA/maxresdefault.jpg',
    youtubeId: '34Na4j8AVgA',
  },
  {
    id: '3',
    title: 'Love Story',
    artist: 'Taylor Swift',
    cover: 'https://i.ytimg.com/vi/8xg3vE8Ie_E/maxresdefault.jpg',
    youtubeId: '8xg3vE8Ie_E',
  },
  {
    id: '4',
    title: 'Hype Boy',
    artist: 'NewJeans',
    cover: 'https://i.ytimg.com/vi/11cta61wi0g/maxresdefault.jpg',
    youtubeId: '11cta61wi0g',
  },
  {
    id: '5',
    title: '普通朋友',
    artist: '陶喆',
    cover: 'https://i.ytimg.com/vi/dJvM2kYd_G0/sddefault.jpg',
    youtubeId: 'dJvM2kYd_G0',
  },
];

type ViewMode = 'vinyl' | 'coverflow';

interface PlayerState {
  isPlaying: boolean;
  currentIndex: number;
  viewMode: ViewMode;
  
  // Actions
  togglePlay: () => void;
  setPlay: (playing: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrackIndex: (index: number) => void;
  toggleViewMode: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentIndex: 0,
  viewMode: 'vinyl',

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlay: (playing) => set({ isPlaying: playing }),
  
  nextTrack: () => set((state) => ({
    currentIndex: (state.currentIndex + 1) % DEMO_PLAYLIST.length,
    isPlaying: true 
  })),
  
  prevTrack: () => set((state) => ({
    currentIndex: (state.currentIndex - 1 + DEMO_PLAYLIST.length) % DEMO_PLAYLIST.length,
    isPlaying: true
  })),

  setTrackIndex: (index) => set({ currentIndex: index, isPlaying: true }),
  
  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === 'vinyl' ? 'coverflow' : 'vinyl' 
  })),
}));