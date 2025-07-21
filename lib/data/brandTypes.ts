// Brand types supported in Amaya
export const BRAND_TYPES = [
  { id: 'standard', name: 'Standard Brand' },
  { id: 'premium', name: 'Premium Brand' },
  { id: 'dropshipping', name: 'Dropshipping Partner' },
];

export const isDropshipping = (type: string) => type === 'dropshipping';
