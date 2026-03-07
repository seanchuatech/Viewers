import type { Button } from '@ohif/core/types';

/**
 * Toolbar button definitions specific to the Dental extension.
 */
const dentalToolbarButtons: Button[] = [
  // ─── Theme toggle ─────────────────────────────────────────────────
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

  // ─── Dental Measurements section (grouping) ───────────────────────
  {
    id: 'DentalMeasurements',
    uiType: 'ohif.toolButtonList',
    props: {
      buttonSection: true,
    },
  },

  // ─── Individual dental measurement preset buttons ─────────────────
  {
    id: 'DentalPALength',
    uiType: 'ohif.toolButton',
    props: {
      icon: 'tool-length',
      label: 'PA Length',
      tooltip: 'Measure periapical length (mm)',
      commands: {
        commandName: 'activateDentalMeasurement',
        commandOptions: { presetKey: 'pa-length' },
      },
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'DentalCanalAngle',
    uiType: 'ohif.toolButton',
    props: {
      icon: 'icon-tool-cobb-angle',
      label: 'Canal Angle',
      tooltip: 'Measure root canal angle (°)',
      commands: {
        commandName: 'activateDentalMeasurement',
        commandOptions: { presetKey: 'canal-angle' },
      },
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'DentalCrownWidth',
    uiType: 'ohif.toolButton',
    props: {
      icon: 'tool-length',
      label: 'Crown Width',
      tooltip: 'Measure crown width (mm)',
      commands: {
        commandName: 'activateDentalMeasurement',
        commandOptions: { presetKey: 'crown-width' },
      },
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'DentalRootLength',
    uiType: 'ohif.toolButton',
    props: {
      icon: 'tool-length',
      label: 'Root Length',
      tooltip: 'Measure root length (mm)',
      commands: {
        commandName: 'activateDentalMeasurement',
        commandOptions: { presetKey: 'root-length' },
      },
      evaluate: 'evaluate.action',
    },
  },
];

export default dentalToolbarButtons;
