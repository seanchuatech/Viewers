export type NumberingSystem = 'FDI' | 'Universal';

export const universalToFdi: Record<number, number> = {
  // Maxillary right (1-8) mapped to UR (18-11)
  1: 18, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11,
  // Maxillary left (9-16) mapped to UL (21-28)
  9: 21, 10: 22, 11: 23, 12: 24, 13: 25, 14: 26, 15: 27, 16: 28,
  // Mandibular left (17-24) mapped to LL (38-31)
  17: 38, 18: 37, 19: 36, 20: 35, 21: 34, 22: 33, 23: 32, 24: 31,
  // Mandibular right (25-32) mapped to LR (41-48)
  25: 41, 26: 42, 27: 43, 28: 44, 29: 45, 30: 46, 31: 47, 32: 48,
};

export const fdiToUniversal: Record<number, number> = Object.entries(universalToFdi).reduce(
  (acc, [univ, fdi]) => {
    acc[fdi as unknown as number] = parseInt(univ, 10);
    return acc;
  },
  {} as Record<number, number>
);

export const formatToothNumber = (universalNumber: number, system: NumberingSystem): string => {
  if (system === 'Universal') return universalNumber.toString();
  return universalToFdi[universalNumber]?.toString() || '';
};
