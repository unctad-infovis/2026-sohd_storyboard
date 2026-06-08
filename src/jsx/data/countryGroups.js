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

// Small island states rendered as dots (too tiny to show as polygons)
export const SMALL_DOTS = [
  // Dual LDC + SIDS
  { ll: [43.3, -11.7], cls: 'dual' }, // Comoros
  { ll: [173.0, 1.4], cls: 'dual' }, // Kiribati
  { ll: [6.6, 0.2], cls: 'dual' }, // São Tomé and Príncipe
  { ll: [179.2, -8.5], cls: 'dual' }, // Tuvalu
  // SIDS only
  { ll: [-61.8, 17.1], cls: 'sids' }, // Antigua and Barbuda
  { ll: [50.6, 26.0], cls: 'sids' }, // Bahrain
  { ll: [-59.5, 13.2], cls: 'sids' }, // Barbados
  { ll: [-23.6, 16.5], cls: 'sids' }, // Cabo Verde
  { ll: [-61.4, 15.4], cls: 'sids' }, // Dominica
  { ll: [-61.7, 12.1], cls: 'sids' }, // Grenada
  { ll: [73.2, 3.2], cls: 'sids' }, // Maldives
  { ll: [171.4, 7.1], cls: 'sids' }, // Marshall Islands
  { ll: [57.6, -20.3], cls: 'sids' }, // Mauritius
  { ll: [158.2, 6.9], cls: 'sids' }, // Micronesia
  { ll: [166.9, -0.5], cls: 'sids' }, // Nauru
  { ll: [134.6, 7.5], cls: 'sids' }, // Palau
  { ll: [-62.7, 17.3], cls: 'sids' }, // Saint Kitts and Nevis
  { ll: [-60.9, 13.9], cls: 'sids' }, // Saint Lucia
  { ll: [-61.2, 13.2], cls: 'sids' }, // Saint Vincent
  { ll: [-171.8, -13.8], cls: 'sids' }, // Samoa
  { ll: [55.5, -4.7], cls: 'sids' }, // Seychelles
  { ll: [-175.2, -21.2], cls: 'sids' }, // Tonga
  { ll: [-159.8, -21.2], cls: 'sids' }, // Cook Islands
  { ll: [-169.9, -19.1], cls: 'sids' } // Niue
];

export const DOT_NAMES = [
  'Comoros',
  'Kiribati',
  'São Tomé and Príncipe',
  'Tuvalu',
  'Antigua and Barbuda',
  'Bahrain',
  'Barbados',
  'Cabo Verde',
  'Dominica',
  'Grenada',
  'Maldives',
  'Marshall Islands',
  'Mauritius',
  'Micronesia',
  'Nauru',
  'Palau',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'Seychelles',
  'Tonga',
  'Cook Islands',
  'Niue'
];
