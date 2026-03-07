import { create } from 'zustand';

export type NumberingSystem = 'FDI' | 'Universal';

interface DentalState {
  selectedTooth: number | null; // Stored as Universal numbering
  numberingSystem: NumberingSystem;
  setSelectedTooth: (tooth: number | null) => void;
  setNumberingSystem: (system: NumberingSystem) => void;
  toggleNumberingSystem: () => void;
}

export const useDentalStore = create<DentalState>((set) => ({
  selectedTooth: null,
  numberingSystem: 'FDI',
  setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
  setNumberingSystem: (system) => set({ numberingSystem: system }),
  toggleNumberingSystem: () =>
    set((state) => ({
      numberingSystem: state.numberingSystem === 'FDI' ? 'Universal' : 'FDI',
    })),
}));
