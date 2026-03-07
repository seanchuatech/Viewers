import React from 'react';
import classnames from 'classnames';
import { useDentalStore } from '../stores/useDentalStore';
import { formatToothNumber } from '../utils/toothNumbering';

const upperRight = [1, 2, 3, 4, 5, 6, 7, 8];
const upperLeft = [9, 10, 11, 12, 13, 14, 15, 16];
const lowerRight = [32, 31, 30, 29, 28, 27, 26, 25];
const lowerLeft = [24, 23, 22, 21, 20, 19, 18, 17];

export function ToothSelector() {
  const { selectedTooth, setSelectedTooth, numberingSystem, toggleNumberingSystem } = useDentalStore();

  const handleToothClick = (tooth: number) => {
    if (selectedTooth === tooth) {
      setSelectedTooth(null);
    } else {
      setSelectedTooth(tooth);
    }
  };

  const renderToothGroup = (teeth: number[]) => (
    <div className="flex gap-[1px]">
      {teeth.map((tooth) => {
        const isSelected = selectedTooth === tooth;
        return (
          <button
            key={tooth}
            className={classnames(
              'flex h-5 w-5 items-center justify-center rounded-[2px] border text-[9px] font-medium transition-colors hover:bg-muted',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border'
            )}
            onClick={() => handleToothClick(tooth)}
          >
            {formatToothNumber(tooth, numberingSystem)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Grid */}
      <div className="flex flex-col gap-[1px] p-1 rounded-md bg-muted/50 border border-border">
        {/* Upper Arch */}
        <div className="flex gap-1 justify-center">
          {renderToothGroup(upperRight)}
          <div className="w-[1px] bg-border mx-px" />
          {renderToothGroup(upperLeft)}
        </div>

        {/* Horizontal Divider */}
        <div className="h-[1px] bg-border w-full" />

        {/* Lower Arch */}
        <div className="flex gap-1 justify-center">
          {renderToothGroup(lowerRight)}
          <div className="w-[1px] bg-border mx-px" />
          {renderToothGroup(lowerLeft)}
        </div>
      </div>

      {/* Numbering System Toggle */}
      <button
        onClick={toggleNumberingSystem}
        className="flex h-10 w-6 items-center justify-center rounded-md border border-border bg-background text-[9px] font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
        title="Toggle Numbering System (Universal / FDI)"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {numberingSystem}
      </button>
    </div>
  );
}

export default ToothSelector;
