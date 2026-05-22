import type { FlightDto } from '../types';

const INDIA = new Set(['DEL','BOM','BLR','HYD','MAA','CCU','GOI','COK','AMD','PNQ','JAI','LKO',
  'IXC','NAG','VNS','PAT','IXZ','STV','BHO','IDR','GAU','IXB','TRV','CJB','IXM','BDQ','SXR',
  'JDH','UDR','ATQ','BBI','RPR','DIB','IMF','AGR','GWL','VGA','KNU','DIU','TEZ']);

const MIDDLE_EAST = new Set(['DXB','AUH','DOH','KWI','BAH','MCT','RUH','JED','AMM','BEY','TLV','IST']);

const SOUTH_ASIA = new Set(['CMB','DAC','KTM','MLE','ISB','KHI','LHE']);

const SE_ASIA = new Set(['SIN','KUL','BKK','CGK','MNL','SGN','HAN','DPS','RGN','PNH']);

const EAST_ASIA = new Set(['HKG','NRT','KIX','ICN','PEK','PVG','CAN','TPE','MFM']);

const EUROPE = new Set(['LHR','LGW','CDG','FRA','MUC','AMS','MAD','BCN','FCO','MXP','ZRH','VIE',
  'CPH','ARN','OSL','HEL','WAW','BUD','PRG','DUB','LIS','ATH','BRU','SVO']);

const NORTH_AMERICA = new Set(['JFK','LAX','ORD','ATL','DFW','DEN','SFO','SEA','BOS','MIA',
  'YYZ','YVR','YUL','MEX']);

const SOUTH_AMERICA = new Set(['GRU','EZE','BOG','SCL','LIM','GIG']);

const AFRICA = new Set(['CAI','JNB','CPT','NBO','ADD','LOS','ACC','CMN','DAR']);

const AUSTRALIA = new Set(['SYD','MEL','BNE','PER','ADL','AKL','CHC']);

const DOMESTIC_AIRLINES = [
  { name: 'IndiGo',     code: '6E' },
  { name: 'Air India',  code: 'AI' },
  { name: 'SpiceJet',   code: 'SG' },
  { name: 'Vistara',    code: 'UK' },
  { name: 'GoFirst',    code: 'G8' },
  { name: 'AirAsia India', code: 'I5' },
];

const INTL_AIRLINES = [
  { name: 'Air India',       code: 'AI' },
  { name: 'Emirates',        code: 'EK' },
  { name: 'Qatar Airways',   code: 'QR' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Lufthansa',       code: 'LH' },
];

function getRegion(iata: string): string {
  if (INDIA.has(iata))         return 'INDIA';
  if (MIDDLE_EAST.has(iata))   return 'MIDDLE_EAST';
  if (SOUTH_ASIA.has(iata))    return 'SOUTH_ASIA';
  if (SE_ASIA.has(iata))       return 'SE_ASIA';
  if (EAST_ASIA.has(iata))     return 'EAST_ASIA';
  if (EUROPE.has(iata))        return 'EUROPE';
  if (NORTH_AMERICA.has(iata)) return 'NORTH_AMERICA';
  if (SOUTH_AMERICA.has(iata)) return 'SOUTH_AMERICA';
  if (AFRICA.has(iata))        return 'AFRICA';
  if (AUSTRALIA.has(iata))     return 'AUSTRALIA';
  return 'OTHER';
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRouteInfo(origin: string, destination: string): { basePrice: number; durationMin: number; durationMax: number } {
  const r1 = getRegion(origin);
  const r2 = getRegion(destination);
  const key = [r1, r2].sort().join('-');

  const routes: Record<string, { basePrice: number; durationMin: number; durationMax: number }> = {
    'INDIA-INDIA':               { basePrice: 2000,   durationMin: 60,   durationMax: 180  },
    'INDIA-SOUTH_ASIA':          { basePrice: 8000,   durationMin: 120,  durationMax: 240  },
    'INDIA-MIDDLE_EAST':         { basePrice: 12000,  durationMin: 180,  durationMax: 300  },
    'INDIA-SE_ASIA':             { basePrice: 18000,  durationMin: 300,  durationMax: 420  },
    'INDIA-EAST_ASIA':           { basePrice: 28000,  durationMin: 360,  durationMax: 540  },
    'INDIA-EUROPE':              { basePrice: 45000,  durationMin: 480,  durationMax: 600  },
    'INDIA-NORTH_AMERICA':       { basePrice: 65000,  durationMin: 840,  durationMax: 1080 },
    'INDIA-SOUTH_AMERICA':       { basePrice: 75000,  durationMin: 1080, durationMax: 1260 },
    'INDIA-AFRICA':              { basePrice: 25000,  durationMin: 360,  durationMax: 600  },
    'INDIA-AUSTRALIA':           { basePrice: 50000,  durationMin: 720,  durationMax: 960  },
    'MIDDLE_EAST-EUROPE':        { basePrice: 35000,  durationMin: 300,  durationMax: 420  },
    'EUROPE-NORTH_AMERICA':      { basePrice: 55000,  durationMin: 480,  durationMax: 600  },
    'EUROPE-EUROPE':             { basePrice: 15000,  durationMin: 90,   durationMax: 240  },
    'NORTH_AMERICA-NORTH_AMERICA': { basePrice: 18000, durationMin: 120, durationMax: 360  },
    'SE_ASIA-EAST_ASIA':         { basePrice: 20000,  durationMin: 180,  durationMax: 360  },
    'MIDDLE_EAST-EAST_ASIA':     { basePrice: 30000,  durationMin: 360,  durationMax: 480  },
    'AFRICA-EUROPE':             { basePrice: 40000,  durationMin: 360,  durationMax: 480  },
    'AUSTRALIA-SE_ASIA':         { basePrice: 30000,  durationMin: 360,  durationMax: 480  },
  };

  return routes[key] ?? { basePrice: 20000, durationMin: 300, durationMax: 600 };
}

function makeFlights(origin: string, destination: string, date: string, count = 6): FlightDto[] {
  const { basePrice, durationMin, durationMax } = getRouteInfo(origin, destination);
  const r1 = getRegion(origin);
  const r2 = getRegion(destination);
  const isDomestic = r1 === 'INDIA' && r2 === 'INDIA';
  const airlines = isDomestic ? DOMESTIC_AIRLINES : INTL_AIRLINES;

  const baseDate = new Date(`${date}T06:00:00`);
  const sources = ['GDS', 'SKYSCANNER', 'INTERNAL'] as const;

  return airlines.slice(0, count).map((al, i) => {
    const dep = new Date(baseDate.getTime() + i * 2.5 * 3600_000);
    const dur = rand(durationMin, durationMax);
    const arr = new Date(dep.getTime() + dur * 60_000);
    const variance = rand(0, Math.round(basePrice * 0.15));

    return {
      flightId:        `00000000-0000-4000-8000-${al.code.split('').map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join('')}${String(i).padStart(8,'0')}`,
      flightNumber:    `${al.code}${200 + i * 47}`,
      airlineName:     al.name,
      airlineCode:     al.code,
      originIata:      origin,
      originCity:      origin,
      destinationIata: destination,
      destinationCity: destination,
      departureTime:   dep.toISOString(),
      arrivalTime:     arr.toISOString(),
      durationMinutes: dur,
      availableSeats:  rand(2, 50),
      basePrice:       basePrice + variance,
      currency:        'INR',
      cabinClass:      'ECONOMY',
      source:          sources[i % 3],
      stops:           i === 3 ? 1 : 0,
    };
  });
}

export function getMockFlights(origin: string, destination: string, date: string): FlightDto[] {
  return makeFlights(origin.toUpperCase(), destination.toUpperCase(), date);
}
