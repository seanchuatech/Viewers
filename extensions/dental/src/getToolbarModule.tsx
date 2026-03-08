import React, { useState, useRef } from 'react';
import type { Button } from '@ohif/core/types';
import { ToolButton } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import MeasurementPalette from './components/MeasurementPalette';

function DentalMeasurementsButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { commandsManager } = useSystem();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={buttonRef}>
      <ToolButton
        {...props}
        icon="tool-length"
        label="Dental Measurements"
        tooltip="Select a dental measurement preset"
        onInteraction={toggleOpen}
        isActive={isOpen}
      />
      {isOpen && (
        <MeasurementPalette
          commandsManager={commandsManager}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * Toolbar button definitions specific to the Dental extension.
 */
const dentalToolbarButtons: Button[] = [
  {
    id: 'DentalThemeToggle',
    uiType: 'ohif.toolButton',
    props: {
      icon: 'tool-window-level',
      label: 'Dental Theme',
      tooltip: 'Toggle Dental Theme',
      commands: 'toggleDentalTheme',
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'DentalMeasurements',
    uiType: 'ohif.toolButton',
    component: DentalMeasurementsButton,
  },
];

export default dentalToolbarButtons;
