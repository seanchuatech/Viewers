import i18n from 'i18next';
import { id } from './id';
import {
  initToolGroups,
  toolbarButtons as basicToolbarButtons,
  toolbarSections as basicToolbarSections,
  cornerstone,
  ohif,
  dicomsr,
  dicomvideo,
  basicLayout,
  basicRoute,
  extensionDependencies as basicDependencies,
  mode as basicMode,
  modeInstance as basicModeInstance,
} from '@ohif/mode-basic';

import dentalToolbarButtons from '@ohif/extension-dental/src/getToolbarModule';

// ---------------------------------------------------------------------------
// Extension dependencies — everything from basic + the dental extension
// ---------------------------------------------------------------------------
export const extensionDependencies = {
  ...basicDependencies,
  '@ohif/extension-dental': '^0.0.1',
};

// ---------------------------------------------------------------------------
// Toolbar — merge in dental-specific buttons and add a secondary section
// ---------------------------------------------------------------------------
const toolbarButtons = [...basicToolbarButtons, ...dentalToolbarButtons];

const toolbarSections = {
  ...basicToolbarSections,
  secondary: ['DentalThemeToggle'],
  primary: [
    ...(basicToolbarSections.primary || []),
    'DentalMeasurements',
  ],
  DentalMeasurements: [
    'DentalPALength',
    'DentalCanalAngle',
    'DentalCrownWidth',
    'DentalRootLength',
  ],
};

// ---------------------------------------------------------------------------
// Namespace constants for the dental extension layout
// ---------------------------------------------------------------------------
const dental = {
  layout: '@ohif/extension-dental.layoutTemplateModule.dentalViewerLayout',
  measurements: '@ohif/extension-dental.panelModule.dentalMeasurements',
};

// ---------------------------------------------------------------------------
// Layout — uses PracticeHeader via DentalViewerLayout
// ---------------------------------------------------------------------------
export const dentalLayout = {
  ...basicLayout,
  id: dental.layout,
  props: {
    ...basicLayout.props,
    rightPanels: [dental.measurements],
    rightPanelClosed: true,
    rightPanelResizable: true,
  },
};

// ---------------------------------------------------------------------------
// Route — mounts at /dental
// ---------------------------------------------------------------------------
export const dentalRoute = {
  ...basicRoute,
  path: 'dental',
  layoutInstance: dentalLayout,
  hangingProtocol: '@ohif/hp-dental-2x2',
};

// ---------------------------------------------------------------------------
// Lifecycle: apply / remove dental theme
// ---------------------------------------------------------------------------
function onModeEnter(args) {
  // Apply the dental theme class so CSS variables kick in
  document.body.classList.add('dental-theme');

  // Call the basic mode's onModeEnter (bound to `this` = modeInstance)
  if (basicModeInstance.onModeEnter) {
    basicModeInstance.onModeEnter.call(this, args);
  }

  // Auto-open dental measurements panel when a measurement is added
  const { panelService, measurementService } = args.servicesManager.services;
  if (panelService && measurementService) {
    this._dentalPanelSubscriptions = [
      ...panelService.addActivatePanelTriggers(
        dental.measurements,
        [
          {
            sourcePubSubService: measurementService,
            sourceEvents: [
              measurementService.EVENTS.MEASUREMENT_ADDED,
              measurementService.EVENTS.RAW_MEASUREMENT_ADDED,
            ],
          },
        ],
        true
      ),
    ];
  }
}

function onModeExit(args) {
  // Remove the dental theme class
  document.body.classList.remove('dental-theme');

  // Unsubscribe panel triggers
  if (this._dentalPanelSubscriptions) {
    this._dentalPanelSubscriptions.forEach(sub => sub.unsubscribe?.());
    this._dentalPanelSubscriptions = [];
  }

  // Call the basic mode's onModeExit
  if (basicModeInstance.onModeExit) {
    basicModeInstance.onModeExit.call(this, args);
  }
}

// ---------------------------------------------------------------------------
// Mode instance
// ---------------------------------------------------------------------------
export const modeInstance = {
  ...basicModeInstance,
  id,
  routeName: 'dental',
  displayName: i18n.t('Modes:Dental Viewer'),
  routes: [dentalRoute],
  extensions: extensionDependencies,
  toolbarButtons,
  toolbarSections,
  onModeEnter,
  onModeExit,
  _dentalPanelSubscriptions: [],
};

// ---------------------------------------------------------------------------
// Mode export
// ---------------------------------------------------------------------------
const mode = {
  ...basicMode,
  id,
  modeInstance,
  extensionDependencies,
};

export default mode;
export { initToolGroups, toolbarButtons };
