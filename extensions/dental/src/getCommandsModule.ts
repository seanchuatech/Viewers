/**
 * Commands for the Dental extension.
 */
import dentalMeasurements from './constants/dentalMeasurements';

function getCommandsModule({ commandsManager, servicesManager }) {
  const { measurementService } = servicesManager.services;

  const actions = {
    /**
     * Toggle the dental theme on/off by adding or removing the
     * `.dental-theme` class on `document.body`.
     */
    toggleDentalTheme: () => {
      document.body.classList.toggle('dental-theme');
    },

    /**
     * Activate a dental measurement preset.
     *
     * 1. Activates the Cornerstone tool specified by the preset.
     * 2. Subscribes (one-shot) to MEASUREMENT_ADDED so that when the
     *    user finishes drawing, the measurement is auto-labeled.
     *
     * @param {object} params
     * @param {string} params.presetKey — key from dentalMeasurements constants
     */
    activateDentalMeasurement: ({ presetKey }: { presetKey: string }) => {
      const preset = dentalMeasurements.find(p => p.key === presetKey);
      if (!preset) {
        console.warn(`[Dental] Unknown measurement preset: ${presetKey}`);
        return;
      }

      // Activate the cornerstone tool across all tool groups
      commandsManager.runCommand('setToolActiveToolbar', {
        toolName: preset.toolName,
      });

      // One-shot listener: auto-label the next measurement that is added
      const { unsubscribe } = measurementService.subscribe(
        measurementService.EVENTS.MEASUREMENT_ADDED,
        ({ measurement }) => {
          // Only label measurements created by the expected tool
          if (measurement.toolName === preset.toolName) {
            commandsManager.runCommand('updateMeasurement', {
              uid: measurement.uid,
              textLabel: preset.label,
            });
          }
          // Unsubscribe after the first matching event
          unsubscribe();
        }
      );
    },
  };

  const definitions = {
    toggleDentalTheme: {
      commandFn: actions.toggleDentalTheme,
    },
    activateDentalMeasurement: {
      commandFn: actions.activateDentalMeasurement,
    },
  };

  return { actions, definitions };
}

export default getCommandsModule;
