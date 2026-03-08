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
import { useDentalStore } from '@ohif/extension-dental/src/stores/useDentalStore';

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
};

// ---------------------------------------------------------------------------
// Layout — use the custom dental layout template
// ---------------------------------------------------------------------------
export const dentalLayout = {
  ...basicLayout,
  id: '@ohif/extension-dental.layoutTemplateModule.dentalViewerLayout',
  props: {
    ...basicLayout.props,
  },
};

// ---------------------------------------------------------------------------
// Route — mounts at /dental
// ---------------------------------------------------------------------------
export const dentalRoute = {
  ...basicRoute,
  path: 'dental',
  layoutInstance: dentalLayout,
};

// ---------------------------------------------------------------------------
// Lifecycle: apply / remove dental theme
// ---------------------------------------------------------------------------
function onModeEnter(args) {
  // Apply the dental theme class
  document.body.classList.add('dental-theme');
  // Sync the store so the header logo is correct
  useDentalStore.getState().setDentalTheme(true);

  // Call the basic mode's onModeEnter (bound to `this` = modeInstance)
  if (basicModeInstance.onModeEnter) {
    basicModeInstance.onModeEnter.call(this, args);
  }
}

function onModeExit(args) {
  // Remove the dental theme class
  document.body.classList.remove('dental-theme');
  // Sync the store
  useDentalStore.getState().setDentalTheme(false);

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
  hangingProtocol: 'dental-2x2',
  toolbarButtons,
  toolbarSections,
  onModeEnter,
  onModeExit,
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
