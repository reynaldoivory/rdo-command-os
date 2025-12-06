/**
 * FALLBACK DATA - Minimal dataset used when migration fails
 * 
 * This ensures the app always has something to display,
 * preventing blank screens even if the database is corrupted.
 */

import type { RDOItem } from './rdo_unified_schema';

export const FALLBACK_ITEMS: RDOItem[] = [
  {
    id: 'navy_revolver',
    name: 'Navy Revolver',
    type: 'Revolver',
    price: {
      value: 275.0,
      confidence: 'HIGH',
      sources: [],
      last_verified: new Date().toISOString(),
    },
    required_rank: 0,
    description: 'Standard issue sidearm',
  },
  {
    id: 'springfield_rifle',
    name: 'Springfield Rifle',
    type: 'Rifle',
    price: {
      value: 355.0,
      confidence: 'HIGH',
      sources: [],
      last_verified: new Date().toISOString(),
    },
    required_rank: 5,
    description: 'Reliable hunting rifle',
  },
  {
    id: 'schofield_revolver',
    name: 'Schofield Revolver',
    type: 'Revolver',
    price: {
      value: 450.0,
      confidence: 'HIGH',
      sources: [],
      last_verified: new Date().toISOString(),
    },
    required_rank: 10,
    description: 'Quick reload mechanism',
  },
  {
    id: 'volcanic_pistol',
    name: 'Volcanic Pistol',
    type: 'Pistol',
    price: {
      value: 490.0,
      confidence: 'MEDIUM',
      sources: [],
      last_verified: new Date().toISOString(),
    },
    required_rank: 15,
    description: 'Heavy damage sidearm',
  },
  {
    id: 'cattleman_revolver',
    name: 'Cattleman Revolver',
    type: 'Revolver',
    price: {
      value: 300.0,
      confidence: 'HIGH',
      sources: [],
      last_verified: new Date().toISOString(),
    },
    required_rank: 0,
    description: 'Classic revolver',
  },
];
