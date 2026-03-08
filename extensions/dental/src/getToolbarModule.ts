import type { Button } from '@ohif/core/types';

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
];

export default dentalToolbarButtons;
