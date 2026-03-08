import { Types } from '@ohif/core';

/**
 * Dental Hanging Protocol — 2x2 Grid
 * 
 * Layout:
 * [ Current Image ] [ Prior Exam (Same Modality) ]
 * [ Bitewing 1    ] [ Bitewing 2                 ]
 */
export const dentalHangingProtocol: Types.HangingProtocol.Protocol = {
  id: 'dental-2x2',
  description: 'Dental 2x2 grid: Current, Prior, and Bitewing placeholders',
  name: 'Dental 2x2',
  protocolMatchingRules: [
    {
      attribute: 'ModalitiesInStudy',
      constraint: {
        contains: 'DX', // Common for dental
      },
    },
  ],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    // 1. Selector for the current study
    currentDisplaySet: {
      seriesMatchingRules: [
        {
          attribute: 'numImageFrames',
          constraint: { greaterThan: 0 },
        },
      ],
      studyMatchingRules: [
        {
          attribute: 'StudyInstanceUID',
          constraint: { equals: '{StudyInstanceUID}' },
        },
      ],
    },
    // 2. Selector for a prior study (same modality)
    priorDisplaySet: {
      seriesMatchingRules: [
        {
          attribute: 'numImageFrames',
          constraint: { greaterThan: 0 },
        },
      ],
      studyMatchingRules: [
        {
          attribute: 'StudyInstanceUID',
          constraint: {
            notEquals: { value: '{StudyInstanceUID}' },
          },
        },
      ],
    },
    // 3. Selector specifically for Bitewing series
    bitewingDisplaySet: {
      seriesMatchingRules: [
        {
          attribute: 'SeriesDescription',
          constraint: {
            contains: 'Bitewing',
          },
        },
        {
          attribute: 'SeriesDescription',
          constraint: {
            contains: 'BW',
          },
        },
      ],
    },
  },
  stages: [
    {
      id: '2x2',
      name: '2x2',
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 2,
          columns: 2,
        },
      },
      viewports: [
        // Top-Left: Current Image
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [{ id: 'currentDisplaySet' }],
        },
        // Top-Right: Prior Exam
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              id: 'priorDisplaySet',
              matchedDisplaySetsIndex: 0,
            },
          ],
        },
        // Bottom-Left: Bitewing 1
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              id: 'bitewingDisplaySet',
              matchedDisplaySetsIndex: 0,
            },
          ],
        },
        // Bottom-Right: Bitewing 2
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              id: 'bitewingDisplaySet',
              matchedDisplaySetsIndex: 1,
            },
          ],
        },
      ],
    },
  ],
  numberOfPriorsReferenced: 1,
};

export default dentalHangingProtocol;
