/**
 * Commands for the Dental extension.
 */
import dentalMeasurements from './constants/dentalMeasurements';
import { useDentalStore } from './stores/useDentalStore';

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
     *    user finishes drawing, the measurement is auto-labeled and tagged with the tooth.
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

      // Capture the currently selected tooth at the time of activation
      const { selectedTooth } = useDentalStore.getState();

      // Activate the cornerstone tool across all tool groups
      commandsManager.runCommand('setToolActiveToolbar', {
        toolName: preset.toolName,
      });

      // One-shot listener: auto-label and tag the next measurement that is added
      const { unsubscribe } = measurementService.subscribe(
        measurementService.EVENTS.MEASUREMENT_ADDED,
        ({ measurement }) => {
          // Only label measurements created by the expected tool
          if (measurement.toolName === preset.toolName) {
            commandsManager.runCommand('updateMeasurement', {
              uid: measurement.uid,
              textLabel: preset.label,
              // Store the tooth number in the measurement metadata/properties
              tooth: selectedTooth,
            });
          }
          // Unsubscribe after the first matching event
          unsubscribe();
        }
      );
    },

    /**
     * Export all measurements as a JSON file.
     */
    exportMeasurementsAsJSON: () => {
      const all = measurementService.getMeasurements();
      
      // Map to a clean structure including study/series and dental-specific info
      const data = all.map(m => {
        const displayText = Array.isArray(m.displayText) ? m.displayText : [];
        const numericMatch = displayText.join(' ').match(/([\d.]+)\s*(mm|°|cm)?/);
        
        return {
          uid: m.uid,
          label: m.label || m.toolName || '—',
          toolName: m.toolName,
          value: numericMatch ? numericMatch[1] : '—',
          unit: numericMatch?.[2] || m.unit || '',
          tooth: m.tooth || null,
          studyInstanceUID: m.StudyInstanceUID,
          seriesInstanceUID: m.SeriesInstanceUID,
          createdAt: m.createdAt,
        };
      });

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dental-measurements-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
  };

  const definitions = {
    toggleDentalTheme: {
      commandFn: actions.toggleDentalTheme,
    },
    activateDentalMeasurement: {
      commandFn: actions.activateDentalMeasurement,
    },
    exportMeasurementsAsJSON: {
      commandFn: actions.exportMeasurementsAsJSON,
    },
  };

  return { actions, definitions };
}

export default getCommandsModule;
