import type { FlightDto } from '../types';

// ── Airport coordinates (lat, lon) ────────────────────────────────────────────
const COORDS: Record<string, [number, number]> = {
  // India
  DEL: [28.5562, 77.1000], BOM: [19.0896, 72.8656], BLR: [13.1986, 77.7066],
  HYD: [17.2403, 78.4294], MAA: [12.9941, 80.1709], CCU: [22.6520, 88.4463],
  GOI: [15.3808, 73.8314], COK: [10.1520, 76.4019], AMD: [23.0771, 72.6347],
  PNQ: [18.5822, 73.9197], JAI: [26.8242, 75.8122], LKO: [26.7606, 80.8893],
  IXC: [30.6735, 76.7885], NAG: [21.0922, 79.0472], VNS: [25.4524, 82.8593],
  PAT: [25.5913, 85.0880], IXZ: [11.6412, 92.7297], STV: [21.1141, 72.7418],
  BHO: [23.2875, 77.3374], IDR: [22.7218, 75.8011], GAU: [26.1061, 91.5859],
  IXB: [26.6812, 88.3286], TRV: [8.4821,  76.9201], CJB: [11.0300, 77.0434],
  IXM: [9.8351,  78.0934], BDQ: [22.3362, 73.2263], SXR: [33.9871, 74.7742],
  JDH: [26.2511, 73.0489], UDR: [24.6177, 73.8961], ATQ: [31.7096, 74.7973],
  BBI: [20.2444, 85.8178], RPR: [21.1804, 81.7388], DIB: [27.4839, 94.9128],
  IMF: [24.7600, 93.8967], AGR: [27.1558, 77.9610], GWL: [26.2933, 78.2278],
  VGA: [16.5301, 80.7968], KNU: [26.4050, 80.3647], DIU: [20.7131, 70.9211],
  TEZ: [26.7082, 92.7847], VTZ: [17.7212, 83.2244], TIR: [13.6324, 79.5432],
  IXR: [23.3143, 85.3217], DED: [30.1897, 78.1804], IXJ: [32.6891, 74.8374],
  IXL: [34.1359, 77.5465], GOP: [26.7397, 83.4497], IXD: [25.4400, 81.7339],
  HBX: [15.3617, 75.0849], IXG: [15.8593, 74.6183], MYQ: [12.2271, 76.6496],
  IXU: [19.8627, 75.3981], KLH: [16.6647, 74.2894], NDC: [19.1833, 77.3167],
  IXE: [12.9613, 74.8900], SHL: [25.7036, 91.9787], AJL: [23.8406, 92.6196],
  IXA: [23.8870, 91.2404], IXS: [24.9129, 92.9787], JRH: [26.7315, 94.1755],
  IXI: [27.2951, 94.0960], JRG: [21.9135, 84.0504], RDP: [23.6225, 87.2436],
  DBR: [26.1667, 85.9167], IXT: [27.5000, 93.0000], IXV: [28.2167, 94.8000],
  // Middle East
  DXB: [25.2532, 55.3657], AUH: [24.4330, 54.6511], DOH: [25.2731, 51.6081],
  KWI: [29.2267, 47.9689], BAH: [26.2708, 50.6336], MCT: [23.5933, 58.2844],
  RUH: [24.9578, 46.6989], JED: [21.6796, 39.1565], AMM: [31.7226, 35.9932],
  BEY: [33.8208, 35.4884], TLV: [32.0114, 34.8867], IST: [41.2753, 28.7519],
  SHJ: [25.3286, 55.5172], MED: [24.5534, 39.7051], GYD: [40.4675, 50.0467],
  AQJ: [29.6117, 35.0181],
  // South Asia
  CMB: [7.1808, 79.8841], DAC: [23.8433, 90.3978], KTM: [27.6966, 85.3591],
  MLE: [4.1918,  73.5290], ISB: [33.6167, 73.0994], KHI: [24.9065, 67.1608],
  LHE: [31.5216, 74.4036],
  // SE Asia
  SIN: [1.3644, 103.9915], KUL: [2.7456, 101.7099], BKK: [13.6900, 100.7501],
  CGK: [-6.1256,106.6559], MNL: [14.5086, 121.0197], SGN: [10.8188, 106.6520],
  HAN: [21.2212, 105.8072], DPS: [-8.7479,115.1670], RGN: [16.9073, 96.1328],
  PNH: [11.5466, 104.8440], HKT: [8.1132,  98.3169], CNX: [18.7680, 98.9629],
  LGK: [6.3297,  99.7282], PEN: [5.2977, 100.2769], CEB: [10.3075, 123.9789],
  DVO: [7.1255, 125.6458],
  // East Asia
  HKG: [22.3080, 113.9185], NRT: [35.7653, 140.3856], KIX: [34.4347, 135.2440],
  ICN: [37.4602, 126.4407], PEK: [40.0799, 116.6031], PVG: [31.1443, 121.8083],
  CAN: [23.3925, 113.2988], TPE: [25.0797, 121.2342], MFM: [22.1496, 113.5916],
  FUK: [33.5839, 130.4511], NGO: [34.8584, 136.8049], OKA: [26.1958, 127.6461],
  CTU: [30.5785, 103.9469], KMG: [24.9922, 102.7443], XIY: [34.4471, 108.7518],
  WUH: [30.7838, 114.2081],
  // Europe
  LHR: [51.4775,  -0.4614], LGW: [51.1481,  -0.1903], CDG: [49.0097,   2.5479],
  FRA: [50.0379,   8.5622], MUC: [48.3538,  11.7861], AMS: [52.3086,   4.7639],
  MAD: [40.4719,  -3.5626], BCN: [41.2971,   2.0785], FCO: [41.8003,  12.2389],
  MXP: [45.6306,   8.7281], ZRH: [47.4582,   8.5483], VIE: [48.1103,  16.5697],
  CPH: [55.6181,  12.6561], ARN: [59.6519,  17.9186], OSL: [60.1939,  11.1004],
  HEL: [60.3172,  24.9633], WAW: [52.1657,  20.9671], BUD: [47.4298,  19.2611],
  PRG: [50.1008,  14.2600], DUB: [53.4213,  -6.2701], LIS: [38.7742,  -9.1342],
  ATH: [37.9364,  23.9445], BRU: [50.9014,   4.4844], SVO: [55.9726,  37.4146],
  GVA: [46.2380,   6.1089], EDI: [55.9500,  -3.3725], MAN: [53.3537,  -2.2750],
  NCE: [43.6584,   7.2159], BER: [52.3667,  13.5033], HAM: [53.6304,   9.9882],
  DUS: [51.2780,   6.7574], STR: [48.6900,   9.2219], NAP: [40.8860,  14.2908],
  LYS: [45.7256,   5.0811], PMI: [39.5517,   2.7388], AGP: [36.6749,  -4.4991],
  TXL: [52.5597,  13.2877],
  // North America
  JFK: [40.6413, -73.7781], LAX: [33.9425,-118.4081], ORD: [41.9742, -87.9073],
  ATL: [33.6407, -84.4277], DFW: [32.8998, -97.0403], DEN: [39.8561,-104.6737],
  SFO: [37.6213,-122.3790], SEA: [47.4502,-122.3088], BOS: [42.3656, -71.0096],
  MIA: [25.7959, -80.2870], YYZ: [43.6772, -79.6306], YVR: [49.1947,-123.1793],
  YUL: [45.4706, -73.7408], MEX: [19.4363, -99.0721], LAS: [36.0840,-115.1537],
  PHX: [33.4373,-112.0078], MSP: [44.8848, -93.2223], DTW: [42.2162, -83.3554],
  EWR: [40.6895, -74.1745], IAD: [38.9531, -77.4565], IAH: [29.9902, -95.3368],
  CLT: [35.2140, -80.9431], MCO: [28.4312, -81.3081], SAN: [32.7336,-117.1897],
  // South America
  GRU: [-23.4356,-46.4731], EZE: [-34.8222,-58.5358], BOG: [4.7016, -74.1469],
  SCL: [-33.3930,-70.7858], LIM: [-12.0219,-77.1143], GIG: [-22.8099,-43.2505],
  CCS: [10.6031, -66.9913], UIO: [-0.1292, -78.3575], MVD: [-34.8384,-56.0308],
  MDE: [6.1645,  -75.4231], VVI: [-17.6446,-63.1354],
  // Africa
  CAI: [30.1219, 31.4056], JNB: [-26.1392, 28.2460], CPT: [-33.9715, 18.6021],
  NBO: [-1.3192,  36.9275], ADD: [8.9779,   38.7993], LOS: [6.5774,   3.3212],
  ACC: [5.6052,  -0.1668], CMN: [33.3675,  -7.5898], DAR: [-6.8781,  39.2026],
  EBB: [0.0424,   32.4435], HRE: [-17.9318, 31.0928], DKR: [14.6706, -17.0720],
  ABJ: [5.2613,  -3.9263], TUN: [36.8510,  10.2272], ALG: [36.6910,   3.2154],
  TIP: [32.6635,  13.1590],
  // Australia & Pacific
  SYD: [-33.9399, 151.1753], MEL: [-37.6690, 144.8410], BNE: [-27.3842, 153.1175],
  PER: [-31.9403, 115.9669], ADL: [-34.9450, 138.5306], AKL: [-37.0082, 174.7917],
  CHC: [-43.4894, 172.5322], CNS: [-16.8858, 145.7553], OOL: [-28.1644, 153.5044],
  HBA: [-42.8361, 147.5078], DRW: [-12.4147, 130.8765], WLG: [-41.3272, 174.8052],
  CBR: [-35.3069, 149.1950],
};

const INDIA_SET = new Set([
  'DEL','BOM','BLR','HYD','MAA','CCU','GOI','COK','AMD','PNQ','JAI','LKO',
  'IXC','NAG','VNS','PAT','IXZ','STV','BHO','IDR','GAU','IXB','TRV','CJB',
  'IXM','BDQ','SXR','JDH','UDR','ATQ','BBI','RPR','DIB','IMF','AGR','GWL',
  'VGA','KNU','DIU','TEZ','VTZ','TIR','IXR','DED','IXJ','IXL','GOP','IXD',
  'HBX','IXG','MYQ','IXU','KLH','NDC','IXE','SHL','AJL','IXA','IXS','JRH',
  'IXI','JRG','RDP','DBR','IXT','IXV',
]);

const DOMESTIC_AIRLINES = [
  { name: 'IndiGo',        code: '6E' },
  { name: 'Air India',     code: 'AI' },
  { name: 'SpiceJet',      code: 'SG' },
  { name: 'Vistara',       code: 'UK' },
  { name: 'GoFirst',       code: 'G8' },
  { name: 'AirAsia India', code: 'I5' },
];

const INTL_AIRLINES = [
  { name: 'Air India',          code: 'AI' },
  { name: 'Emirates',           code: 'EK' },
  { name: 'Qatar Airways',      code: 'QR' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'British Airways',    code: 'BA' },
  { name: 'Lufthansa',          code: 'LH' },
];

// ── Haversine great-circle distance (km) ──────────────────────────────────────
function haversineKm(iata1: string, iata2: string): number {
  const c1 = COORDS[iata1];
  const c2 = COORDS[iata2];
  if (!c1 || !c2) return 3000; // fallback

  const R   = 6371;
  const dLat = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLon = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a   = Math.sin(dLat / 2) ** 2
             + Math.cos((c1[0] * Math.PI) / 180)
             * Math.cos((c2[0] * Math.PI) / 180)
             * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Realistic price based on distance ────────────────────────────────────────
function calcPrice(distKm: number, isDomestic: boolean): number {
  let price: number;

  if (isDomestic) {
    // Indian domestic pricing (INR)
    if (distKm < 500)       price = distKm * 6.5 + 1200;
    else if (distKm < 1000) price = distKm * 4.8 + 1800;
    else if (distKm < 2000) price = distKm * 3.8 + 2200;
    else                    price = distKm * 3.2 + 2800;
  } else {
    // International pricing — higher per-km due to overflight fees, taxes, fuel
    if (distKm < 1500)       price = distKm * 9.5 + 2500;
    else if (distKm < 3000)  price = distKm * 8.0 + 3500;
    else if (distKm < 6000)  price = distKm * 7.0 + 5500;
    else if (distKm < 10000) price = distKm * 8.2 + 6500;
    else                     price = distKm * 7.0 + 9500;
  }

  // Round to nearest 99 (airline-style pricing)
  return Math.round(price / 100) * 100 - 1;
}

// ── Flight duration from distance ─────────────────────────────────────────────
function calcDurationMin(distKm: number): number {
  // Cruising speed ~870 km/h + 45 min for ground ops / climb / descent
  return Math.round((distKm / 870) * 60) + 45;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeFlights(origin: string, destination: string, date: string, count = 6): FlightDto[] {
  const distKm     = haversineKm(origin, destination);
  const isDomestic = INDIA_SET.has(origin) && INDIA_SET.has(destination);
  const basePrice  = calcPrice(distKm, isDomestic);
  const duration   = calcDurationMin(distKm);
  const airlines   = isDomestic ? DOMESTIC_AIRLINES : INTL_AIRLINES;

  const baseDate = new Date(`${date}T06:00:00`);
  const sources  = ['GDS', 'SKYSCANNER', 'INTERNAL'] as const;

  return airlines.slice(0, count).map((al, i) => {
    const dep      = new Date(baseDate.getTime() + i * 2.5 * 3600_000);
    const durVar   = rand(-15, 20);                     // ±15-20 min variance per airline
    const dur      = duration + durVar;
    const arr      = new Date(dep.getTime() + dur * 60_000);
    const variance = rand(-Math.round(basePrice * 0.08), Math.round(basePrice * 0.18));

    return {
      flightId:        `00000000-0000-4000-8000-${al.code.split('').map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join('')}${String(i).padStart(8,'0')}`,
      flightNumber:    `${al.code}-${200 + i * 47}`,
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
      basePrice:       Math.max(basePrice + variance, 999),
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
