import { create } from 'zustand';

export type NumberingSystem = 'FDI' | 'Universal';

interface DentalState {
  selectedTooth: number | null; // Stored as Universal numbering
  numberingSystem: NumberingSystem;
  isDentalTheme: boolean;
  setSelectedTooth: (tooth: number | null) => void;
  setNumberingSystem: (system: NumberingSystem) => void;
  toggleNumberingSystem: () => void;
  setDentalTheme: (isDentalTheme: boolean) => void;
  toggleDentalTheme: () => void;
}

export const useDentalStore = create<DentalState>((set) => ({
  selectedTooth: null,
  numberingSystem: 'FDI',
  isDentalTheme: true, // Default to true when mode is active
  setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
  setNumberingSystem: (system) => set({ numberingSystem: system }),
  toggleNumberingSystem: () =>
    set((state) => ({
      numberingSystem: state.numberingSystem === 'FDI' ? 'Universal' : 'FDI',
    })),
  setDentalTheme: (isDentalTheme) => {
    console.log('[useDentalStore] setDentalTheme:', isDentalTheme);
    if (isDentalTheme) {
      document.body.classList.add('dental-theme');
    } else {
      document.body.classList.remove('dental-theme');
    }
    set({ isDentalTheme });
  },
  toggleDentalTheme: () =>
    set((state) => {
      const next = !state.isDentalTheme;
      console.log(`[useDentalStore] toggleDentalTheme clicked. Current: ${state.isDentalTheme}, Next: ${next}`);
      if (next) {
        document.body.classList.add('dental-theme');
      } else {
        document.body.classList.remove('dental-theme');
      }
      return { isDentalTheme: next };
    }),
}));

