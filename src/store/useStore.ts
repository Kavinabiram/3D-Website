import { create } from 'zustand';

export interface Configuration {
  baseType: 'dark' | 'milk' | 'white';
  cacaoPercentage: number;
  toppings: string[];
  packaging: 'classic' | 'premium' | 'collector';
}

interface AppState {
  activeSection: number;
  setActiveSection: (section: number) => void;
  dpr: number;
  setDpr: (val: number) => void;
  config: Configuration;
  updateConfig: (updater: (prev: Configuration) => void) => void;
  getPrice: () => number;
  soundMuted: boolean;
  setSoundMuted: (val: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (val: number) => void;
  isLoaded: boolean;
  setIsLoaded: (val: boolean) => void;
}

const BASE_PRICES = { dark: 12.0, milk: 11.5, white: 12.5 };
const TOPPING_PRICES: Record<string, number> = {
  gold_dust: 5.0,
  sea_salt: 1.5,
  raspberry: 2.0,
  hazelnut: 2.0
};
const PACKAGING_PRICES = { classic: 0.0, premium: 4.5, collector: 8.0 };

export const useStore = create<AppState>((set, get) => ({
  activeSection: 0,
  setActiveSection: (section) => set({ activeSection: section }),
  dpr: 1.5,
  setDpr: (val) => set({ dpr: val }),
  config: {
    baseType: 'dark',
    cacaoPercentage: 70,
    toppings: [],
    packaging: 'classic',
  },
  updateConfig: (updater) => {
    set((state) => {
      const nextConfig = { ...state.config };
      updater(nextConfig);
      return { config: nextConfig };
    });
  },
  getPrice: () => {
    const { config } = get();
    const base = BASE_PRICES[config.baseType];
    const toppingsSum = config.toppings.reduce((sum, top) => sum + (TOPPING_PRICES[top] || 0), 0);
    const packagingVal = PACKAGING_PRICES[config.packaging];
    return base + toppingsSum + packagingVal;
  },
  soundMuted: true,
  setSoundMuted: (val) => set({ soundMuted: val }),
  loadingProgress: 0,
  setLoadingProgress: (val) => set({ loadingProgress: val }),
  isLoaded: false,
  setIsLoaded: (val) => set({ isLoaded: val }),
}));

export default useStore;
