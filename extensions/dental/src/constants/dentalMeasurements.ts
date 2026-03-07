/**
 * Dental measurement presets.
 *
 * Each preset maps to a Cornerstone annotation tool and carries a
 * label that will be auto-applied when the measurement is added.
 */

export interface DentalMeasurementPreset {
  /** Unique key used to reference this preset programmatically. */
  key: string;
  /** Human-readable label applied to the measurement annotation. */
  label: string;
  /** Cornerstone tool name to activate (e.g. 'Length', 'CobbAngle'). */
  toolName: string;
  /** Display unit (e.g. 'mm', '°'). */
  unit: string;
}

const dentalMeasurements: DentalMeasurementPreset[] = [
  {
    key: 'pa-length',
    label: 'PA Length',
    toolName: 'Length',
    unit: 'mm',
  },
  {
    key: 'canal-angle',
    label: 'Canal Angle',
    toolName: 'CobbAngle',
    unit: '°',
  },
  {
    key: 'crown-width',
    label: 'Crown Width',
    toolName: 'Length',
    unit: 'mm',
  },
  {
    key: 'root-length',
    label: 'Root Length',
    toolName: 'Length',
    unit: 'mm',
  },
];

export default dentalMeasurements;
