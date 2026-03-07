import React, { useState, useRef, useEffect } from 'react';
import dentalMeasurements from '../constants/dentalMeasurements';

/**
 * Icon map — maps tool names to existing OHIF icon identifiers.
 */
const TOOL_ICONS: Record<string, string> = {
  Length: 'tool-length',
  CobbAngle: 'icon-tool-cobb-angle',
};

interface MeasurementPaletteProps {
  commandsManager: any;
  onClose?: () => void;
}

/**
 * MeasurementPalette — a popup component that lists dental measurement
 * presets as clickable buttons. Selecting a preset activates the
 * corresponding Cornerstone tool with auto-labeling.
 */
const MeasurementPalette: React.FC<MeasurementPaletteProps> = ({
  commandsManager,
  onClose,
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handlePresetClick = (presetKey: string) => {
    setActivePreset(presetKey);
    commandsManager.runCommand('activateDentalMeasurement', { presetKey });
    onClose?.();
  };

  return (
    <div
      ref={paletteRef}
      className="bg-popover border-secondary-light absolute top-full z-50 mt-1 min-w-[200px] rounded-md border p-1 shadow-lg"
    >
      <div className="text-muted-foreground mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wide">
        Dental Measurements
      </div>
      {dentalMeasurements.map(preset => (
        <button
          key={preset.key}
          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors
            ${
              activePreset === preset.key
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent'
            }`}
          onClick={() => handlePresetClick(preset.key)}
        >
          <span className="flex-1">{preset.label}</span>
          <span className="text-muted-foreground text-xs">{preset.unit}</span>
        </button>
      ))}
    </div>
  );
};

export default MeasurementPalette;
