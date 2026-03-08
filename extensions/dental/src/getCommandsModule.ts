import { useDentalStore } from './stores/useDentalStore';
import dentalMeasurements from './constants/dentalMeasurements';

/**
 * Commands for the Dental extension.
 */
function getCommandsModule({ commandsManager, servicesManager }) {
  const { measurementService, toolbarService, displaySetService } = servicesManager.services;

  const actions = {
    /**
     * Toggle the dental theme on/off by adding or removing the
     * `.dental-theme` class on `document.body` AND updating the store.
     */
    toggleDentalTheme: () => {
      // Toggle the DOM class directly (this is what works visually)
      document.body.classList.toggle('dental-theme');

      // Sync the store so UI components (like PracticeHeader logo) update
      const isThemeActive = document.body.classList.contains('dental-theme');
      useDentalStore.getState().setDentalTheme(isThemeActive);
    },

    /**
     * Activate a dental measurement preset.
     * Activates the tool and sets up a one-time listener to label the next measurement.
     */
    activateDentalMeasurement: ({ presetKey }) => {
      const preset = dentalMeasurements.find(m => m.key === presetKey);
      if (!preset) {
        console.warn(`[Dental] No measurement preset found for key: ${presetKey}`);
        return;
      }

      const { toolName, label } = preset;
      const { selectedTooth } = useDentalStore.getState();

      // 1. Activate the tool via the toolbar service
      toolbarService.recordInteraction({
        groupId: toolName,
        itemId: toolName,
        interactionType: 'tool',
        commands: [
          {
            commandName: 'setToolActive',
            commandOptions: {
              toolName,
            },
            context: 'CORNERSTONE',
          },
        ],
      });

      // 2. Add a one-time listener to the measurement service
      const { unsubscribe } = measurementService.subscribe(
        measurementService.EVENTS.MEASUREMENT_ADDED,
        ({ measurement }) => {
          if (measurement.toolName === toolName) {
            measurementService.update(measurement.uid, {
              ...measurement,
              label,
              tooth: selectedTooth,
            });
          }
          unsubscribe();
        }
      );
    },

    /**
     * Export all current measurements as a JSON file.
     */
    exportMeasurementsAsJSON: () => {
      const measurements = measurementService.getMeasurements();
      
      // Get some basic study info from the first measurement if available
      let studyInfo = {};
      if (measurements.length > 0) {
        const first = measurements[0];
        const displaySet = displaySetService.getDisplaySetByUID(first.displaySetInstanceUID);
        if (displaySet) {
          studyInfo = {
            PatientName: displaySet.PatientName,
            PatientID: displaySet.PatientID,
            StudyInstanceUID: displaySet.StudyInstanceUID,
            StudyDate: displaySet.StudyDate,
          };
        }
      }

      const dataToExport = {
        exportDate: new Date().toISOString(),
        study: studyInfo,
        measurements: measurements.map(m => ({
          uid: m.uid,
          label: m.label,
          toolName: m.toolName,
          value: m.displayText, // This usually contains the formatted strings
          tooth: m.tooth,
          unit: m.unit,
        })),
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dental-measurements-${new Date().getTime()}.json`;
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
