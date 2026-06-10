import { COUNTRIES } from './countries';

export const LDC = new Set([
  'AFG',
  'AGO',
  'BGD',
  'BEN',
  'BTN',
  'BFA',
  'BDI',
  'KHM',
  'CAF',
  'TCD',
  'COM',
  'COD',
  'DJI',
  'ERI',
  'ETH',
  'GMB',
  'GIN',
  'GNB',
  'HTI',
  'KIR',
  'LAO',
  'LSO',
  'LBR',
  'MDG',
  'MWI',
  'MLI',
  'MRT',
  'MOZ',
  'MMR',
  'NPL',
  'NER',
  'RWA',
  'STP',
  'SEN',
  'SLE',
  'SLB',
  'SOM',
  'SSD',
  'SDN',
  'TZA',
  'TLS',
  'TGO',
  'TUV',
  'UGA',
  'YEM',
  'ZMB'
]);

export const SIDS = new Set([
  // Caribbean
  'ATG',
  'BHS',
  'BRB',
  'BLZ',
  'CUB',
  'DMA',
  'DOM',
  'GRD',
  'GUY',
  'HTI',
  'JAM',
  'KNA',
  'LCA',
  'VCT',
  'SUR',
  'TTO',
  // AIS
  'CPV',
  'COM',
  'MDV',
  'MUS',
  'STP',
  'SYC',
  'SGP',
  'GNB',
  // Pacific
  'FJI',
  'KIR',
  'MHL',
  'FSM',
  'NRU',
  'NIU',
  'PLW',
  'PNG',
  'WSM',
  'SLB',
  'TLS',
  'TON',
  'TUV',
  'VUT',
  'COK'
]);

// Returns 'ldc', 'sids', 'dual', or null for any ISO3 code.
export function getGroup(iso3) {
  const inLdc = LDC.has(iso3);
  const inSids = SIDS.has(iso3);
  if (inLdc && inSids) return 'dual';
  if (inLdc) return 'ldc';
  if (inSids) return 'sids';
  return null;
}

// Derived from countries.js — dot field marks islands too small to render as polygons.
const dotEntries = Object.values(COUNTRIES).filter(c => c.dot !== null);
export const SMALL_DOTS = dotEntries.map(c => ({ ll: c.ll, cls: c.dot }));
export const DOT_NAMES = dotEntries.map(c => c.name);
