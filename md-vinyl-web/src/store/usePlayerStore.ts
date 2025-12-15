import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEMO_PLAYLIST = [
  { id: '1', title: 'Love Story', artist: 'Taylor Swift', genre: 'Country Pop', cover: 'https://i.ytimg.com/vi/8xg3vE8Ie_E/sddefault.jpg', youtubeId: '8xg3vE8Ie_E' },
  { id: '2', title: "Moanin'", artist: 'Art Blakey', genre: 'Jazz', cover: 'https://i.ytimg.com/vi/Cv9NSR-2DwM/hqdefault.jpg', youtubeId: 'Cv9NSR-2DwM' },
  // ✅ 修正：已更新陶喆《普通朋友》資料
  { id: '3', title: '普通朋友', artist: '陶喆', genre: 'R&B', cover: 'https://i.ytimg.com/vi/3L3Me4JXVqE/hqdefault.jpg', youtubeId: '3L3Me4JXVqE' },
  { id: '4', title: 'DASH', artist: 'NMIXX', genre: 'K-Pop', cover: 'https://i.ytimg.com/vi/7UecFm_bSTU/sddefault.jpg', youtubeId: '7UecFm_bSTU' },
  { id: '5', title: 'Some (썸)', artist: 'BOL4', genre: 'Indie', cover: 'https://i.ytimg.com/vi/hZmoMyFXDoI/sddefault.jpg', youtubeId: 'hZmoMyFXDoI' },
];

type AiTheme = {
  bgRGB: string;
  text: string;
  secondary: string;
  accent: string;
  isDark: boolean;
};

const DARK_THEME: AiTheme = { bgRGB: '5, 5, 5', text: '#ffffff', secondary: '#9ca3af', accent: '#ffffff', isDark: true };
const LIGHT_THEME: AiTheme = { bgRGB: '245, 245, 247', text: '#111827', secondary: '#4b5563', accent: '#000000', isDark: false };

interface PlayerState {
  isPlaying: boolean;
  currentIndex: number;
  viewMode: 'vinyl' | 'coverflow';
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  isSeeking: boolean;
  groqApiKey: string;
  theme: AiTheme;
  isAiMode: boolean;
  playlist: any[];
  
  togglePlay: () => void;
  setPlay: (playing: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrackIndex: (index: number) => void;
  toggleViewMode: () => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setProgress: (val: number, current: number, total: number) => void;
  setIsSeeking: (seeking: boolean) => void;
  setGroqApiKey: (key: string) => void;
  setTheme: (theme: AiTheme) => void;
  toggleAiMode: () => void;
  toggleTheme: () => void; 
  setPlaylist: (list: any[]) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      isPlaying: false,
      currentIndex: 0,
      viewMode: 'coverflow',
      volume: 50,
      isMuted: false,
      progress: 0,
      duration: 0,
      currentTime: 0,
      isSeeking: false,
      groqApiKey: '',
      theme: DARK_THEME,
      isAiMode: false,
      playlist: [],

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlay: (playing) => set({ isPlaying: playing }),
      
      nextTrack: () => set((state) => ({ currentIndex: (state.currentIndex + 1) % DEMO_PLAYLIST.length, isPlaying: true })),
      prevTrack: () => set((state) => ({ currentIndex: (state.currentIndex - 1 + DEMO_PLAYLIST.length) % DEMO_PLAYLIST.length, isPlaying: true })),
      setTrackIndex: (index) => set({ currentIndex: index, isPlaying: true }),
      toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'vinyl' ? 'coverflow' : 'vinyl' })),
      setVolume: (val) => set({ volume: val, isMuted: val === 0 }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setProgress: (val, current, total) => set({ progress: val, currentTime: current, duration: total }),
      setIsSeeking: (seeking) => set({ isSeeking: seeking }),
      setGroqApiKey: (key) => set({ groqApiKey: key }),
      setTheme: (newTheme) => set({ theme: newTheme }),
      
      toggleAiMode: () => set((state) => {
        const nextMode = !state.isAiMode;
        return { 
            isAiMode: nextMode,
            theme: nextMode ? state.theme : (state.theme.isDark ? DARK_THEME : LIGHT_THEME)
        };
      }),

      toggleTheme: () => set((state) => {
        const nextIsDark = !state.theme.isDark;
        if (!state.isAiMode) return { theme: nextIsDark ? DARK_THEME : LIGHT_THEME };
        return { theme: { ...state.theme, isDark: nextIsDark } };
      }),

      setPlaylist: (list) => set({ playlist: list }),
    }),
    {
      name: 'md-vinyl-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        viewMode: state.viewMode, 
        theme: state.theme, 
        groqApiKey: state.groqApiKey,
        isAiMode: state.isAiMode 
      }),
    }
  )
);