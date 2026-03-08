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

/**
 * DentalStore — manages state for the dental extension.
 * Note: DOM manipulation (adding/removing .dental-theme) is handled
 * by commands and mode lifecycle hooks to avoid double-toggling issues.
 */
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
    set({ isDentalTheme });
  },
  toggleDentalTheme: () =>
    set((state) => ({ isDentalTheme: !state.isDentalTheme })),
}));
