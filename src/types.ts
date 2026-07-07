export type Experiment = {
  id: string;
  name: string;
  description: string;
  steps: string[];
};

export type Reagent = {
  id: string;
  label: string;
  color: string;
  type: 'sample' | 'halogen';
};

export type LogEntry = {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'bromine_test',
    name: 'Bromine Water Test',
    description: 'Test for unsaturation using Bromine water.',
    steps: [
      'Select a sample (Hexane or Cyclohexene).',
      'Add Bromine Water (orange).',
      'Shake the tube and observe any color change.'
    ]
  },
  {
    id: 'iodine_test',
    name: 'Iodine Solution Test',
    description: 'Test for unsaturation using Iodine solution.',
    steps: [
      'Select a sample (Hexane or Cyclohexene).',
      'Add Iodine Solution (brown).',
      'Shake the tube and observe any color change.'
    ]
  }
];

export const REAGENTS: Record<string, Reagent> = {
  hexane: { id: 'hexane', label: 'Hexane (Alkane)', color: 'rgba(255,255,255,0.15)', type: 'sample' },
  cyclohexene: { id: 'cyclohexene', label: 'Cyclohexene (Alkene)', color: 'rgba(255,255,255,0.15)', type: 'sample' },
  bromine: { id: 'bromine', label: 'Bromine Water', color: '#ea580c', type: 'halogen' },
  iodine: { id: 'iodine', label: 'Iodine Solution', color: '#854d0e', type: 'halogen' },
};
