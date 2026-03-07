import { Types } from '@ohif/core';

export const dentalHangingProtocol: Types.HangingProtocol.Protocol = {
  id: '@ohif/hp-dental-2x2',
  description: 'Dental 2x2 grid',
  name: 'Dental 2x2',
  protocolMatchingRules: [
    {
      attribute: 'ModalitiesInStudy',
      constraint: {
        contains: 'DX', // or anything else, leaving broad for now
      },
    },
  ],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    defaultDisplaySetId: {
      allowUnmatchedView: true,
      seriesMatchingRules: [
        {
          weight: 10,
          attribute: 'numImageFrames',
          constraint: {
            greaterThan: { value: 0 },
          },
        },
      ],
    },
  },
  defaultViewport: {
    viewportOptions: {
      viewportType: 'stack',
      toolGroupId: 'default',
    },
    displaySets: [
      {
        id: 'defaultDisplaySetId',
        matchedDisplaySetsIndex: -1,
      },
    ],
  },
  stages: [
    {
      id: '2x2',
      name: '2x2',
      stageActivation: {
        enabled: {
          minViewportsMatched: 1,
        },
      },
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 2,
          columns: 2,
        },
      },
      viewports: [
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              id: 'defaultDisplaySetId',
            },
          ],
        },
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              matchedDisplaySetsIndex: 1,
              id: 'defaultDisplaySetId',
            },
          ],
        },
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              matchedDisplaySetsIndex: 2,
              id: 'defaultDisplaySetId',
            },
          ],
        },
        {
          viewportOptions: {
            viewportType: 'stack',
            toolGroupId: 'default',
          },
          displaySets: [
            {
              matchedDisplaySetsIndex: 3,
              id: 'defaultDisplaySetId',
            },
          ],
        },
      ],
    },
  ],
  numberOfPriorsReferenced: -1,
};

export default dentalHangingProtocol;
