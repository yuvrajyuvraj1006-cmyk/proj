import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FlightSearchRequest } from '../types';

const AIRPORTS = [
  // ── India ──────────────────────────────────────────────────────
  { iata: 'DEL', city: 'Delhi',        name: 'Indira Gandhi International Airport' },
  { iata: 'BOM', city: 'Mumbai',       name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { iata: 'BLR', city: 'Bengaluru',    name: 'Kempegowda International Airport' },
  { iata: 'HYD', city: 'Hyderabad',    name: 'Rajiv Gandhi International Airport' },
  { iata: 'MAA', city: 'Chennai',      name: 'Chennai International Airport' },
  { iata: 'CCU', city: 'Kolkata',      name: 'Netaji Subhas Chandra Bose International Airport' },
  { iata: 'GOI', city: 'Goa',          name: 'Goa International Airport' },
  { iata: 'COK', city: 'Kochi',        name: 'Cochin International Airport' },
  { iata: 'AMD', city: 'Ahmedabad',    name: 'Sardar Vallabhbhai Patel International Airport' },
  { iata: 'PNQ', city: 'Pune',         name: 'Pune Airport' },
  { iata: 'JAI', city: 'Jaipur',       name: 'Jaipur International Airport' },
  { iata: 'LKO', city: 'Lucknow',      name: 'Chaudhary Charan Singh International Airport' },
  { iata: 'IXC', city: 'Chandigarh',   name: 'Chandigarh Airport' },
  { iata: 'NAG', city: 'Nagpur',       name: 'Dr. Babasaheb Ambedkar International Airport' },
  { iata: 'VNS', city: 'Varanasi',     name: 'Lal Bahadur Shastri Airport' },
  { iata: 'PAT', city: 'Patna',        name: 'Jay Prakash Narayan Airport' },
  { iata: 'IXZ', city: 'Port Blair',   name: 'Veer Savarkar International Airport' },
  { iata: 'STV', city: 'Surat',        name: 'Surat Airport' },
  { iata: 'BHO', city: 'Bhopal',       name: 'Raja Bhoj Airport' },
  { iata: 'IDR', city: 'Indore',       name: 'Devi Ahilyabai Holkar Airport' },
  { iata: 'GAU', city: 'Guwahati',     name: 'Lokpriya Gopinath Bordoloi International Airport' },
  { iata: 'IXB', city: 'Bagdogra',     name: 'Bagdogra Airport' },
  { iata: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum International Airport' },
  { iata: 'CJB', city: 'Coimbatore',   name: 'Coimbatore International Airport' },
  { iata: 'IXM', city: 'Madurai',      name: 'Madurai Airport' },
  { iata: 'BDQ', city: 'Vadodara',     name: 'Vadodara Airport' },
  { iata: 'SXR', city: 'Srinagar',     name: 'Sheikh ul-Alam Airport' },
  { iata: 'JDH', city: 'Jodhpur',      name: 'Jodhpur Airport' },
  { iata: 'UDR', city: 'Udaipur',      name: 'Maharana Pratap Airport' },
  { iata: 'ATQ', city: 'Amritsar',     name: 'Sri Guru Ram Dass Jee International Airport' },
  { iata: 'BBI', city: 'Bhubaneswar',  name: 'Biju Patnaik International Airport' },
  { iata: 'RPR', city: 'Raipur',       name: 'Swami Vivekananda Airport' },
  { iata: 'DIB', city: 'Dibrugarh',    name: 'Dibrugarh Airport' },
  { iata: 'IMF', city: 'Imphal',       name: 'Bir Tikendrajit International Airport' },
  { iata: 'AGR', city: 'Agra',         name: 'Agra Airport' },
  { iata: 'GWL', city: 'Gwalior',      name: 'Gwalior Airport' },
  { iata: 'VGA', city: 'Vijayawada',   name: 'Vijayawada Airport' },
  { iata: 'KNU', city: 'Kanpur',       name: 'Kanpur Airport' },
  { iata: 'DIU', city: 'Diu',          name: 'Diu Airport' },
  { iata: 'TEZ', city: 'Tezpur',       name: 'Tezpur Airport' },
  { iata: 'VTZ', city: 'Visakhapatnam', name: 'Visakhapatnam Airport' },
  { iata: 'TIR', city: 'Tirupati',     name: 'Tirupati Airport' },
  { iata: 'IXR', city: 'Ranchi',       name: 'Birsa Munda Airport' },
  { iata: 'DED', city: 'Dehradun',     name: 'Jolly Grant Airport' },
  { iata: 'IXJ', city: 'Jammu',        name: 'Jammu Airport' },
  { iata: 'IXL', city: 'Leh',          name: 'Kushok Bakula Rimpochee Airport' },
  { iata: 'GOP', city: 'Gorakhpur',    name: 'Gorakhpur Airport' },
  { iata: 'IXD', city: 'Prayagraj',    name: 'Prayagraj Airport' },
  { iata: 'HBX', city: 'Hubli',        name: 'Hubli Airport' },
  { iata: 'IXG', city: 'Belagavi',     name: 'Belgaum Airport' },
  { iata: 'MYQ', city: 'Mysuru',       name: 'Mysore Airport' },
  { iata: 'IXU', city: 'Aurangabad',   name: 'Chikkalthana Airport' },
  { iata: 'KLH', city: 'Kolhapur',     name: 'Kolhapur Airport' },
  { iata: 'NDC', city: 'Nanded',       name: 'Shri Guru Gobind Singh Ji Airport' },
  { iata: 'IXE', city: 'Mangalore',    name: 'Mangalore International Airport' },
  { iata: 'SHL', city: 'Shillong',     name: 'Shillong Airport' },
  { iata: 'AJL', city: 'Aizawl',       name: 'Lengpui Airport' },
  { iata: 'IXA', city: 'Agartala',     name: 'Maharaja Bir Bikram Airport' },
  { iata: 'IXS', city: 'Silchar',      name: 'Silchar Airport' },
  { iata: 'JRH', city: 'Jorhat',       name: 'Jorhat Airport' },
  { iata: 'IXI', city: 'Lilabari',     name: 'Lilabari Airport' },
  { iata: 'JRG', city: 'Jharsuguda',   name: 'Veer Surendra Sai Airport' },
  { iata: 'RDP', city: 'Durgapur',     name: 'Kazi Nazrul Islam Airport' },
  { iata: 'DBR', city: 'Darbhanga',    name: 'Darbhanga Airport' },
  // ── Middle East ────────────────────────────────────────────────
  { iata: 'DXB', city: 'Dubai',        name: 'Dubai International Airport' },
  { iata: 'AUH', city: 'Abu Dhabi',    name: 'Abu Dhabi International Airport' },
  { iata: 'DOH', city: 'Doha',         name: 'Hamad International Airport' },
  { iata: 'KWI', city: 'Kuwait City',  name: 'Kuwait International Airport' },
  { iata: 'BAH', city: 'Bahrain',      name: 'Bahrain International Airport' },
  { iata: 'MCT', city: 'Muscat',       name: 'Muscat International Airport' },
  { iata: 'RUH', city: 'Riyadh',       name: 'King Khalid International Airport' },
  { iata: 'JED', city: 'Jeddah',       name: 'King Abdulaziz International Airport' },
  { iata: 'AMM', city: 'Amman',        name: 'Queen Alia International Airport' },
  { iata: 'BEY', city: 'Beirut',       name: 'Beirut Rafic Hariri International Airport' },
  { iata: 'TLV', city: 'Tel Aviv',     name: 'Ben Gurion Airport' },
  { iata: 'IST', city: 'Istanbul',     name: 'Istanbul Airport' },
  { iata: 'SHJ', city: 'Sharjah',     name: 'Sharjah International Airport' },
  { iata: 'MED', city: 'Medina',       name: 'Prince Mohammad Bin Abdulaziz Airport' },
  { iata: 'GYD', city: 'Baku',         name: 'Heydar Aliyev International Airport' },
  { iata: 'AQJ', city: 'Aqaba',        name: 'King Hussein International Airport' },
  // ── South Asia ─────────────────────────────────────────────────
  { iata: 'CMB', city: 'Colombo',      name: 'Bandaranaike International Airport' },
  { iata: 'DAC', city: 'Dhaka',        name: 'Hazrat Shahjalal International Airport' },
  { iata: 'KTM', city: 'Kathmandu',    name: 'Tribhuvan International Airport' },
  { iata: 'MLE', city: 'Malé',         name: 'Velana International Airport' },
  { iata: 'ISB', city: 'Islamabad',    name: 'Islamabad International Airport' },
  { iata: 'KHI', city: 'Karachi',      name: 'Jinnah International Airport' },
  { iata: 'LHE', city: 'Lahore',       name: 'Allama Iqbal International Airport' },
  // ── Southeast Asia ─────────────────────────────────────────────
  { iata: 'SIN', city: 'Singapore',    name: 'Changi Airport' },
  { iata: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International Airport' },
  { iata: 'BKK', city: 'Bangkok',      name: 'Suvarnabhumi Airport' },
  { iata: 'CGK', city: 'Jakarta',      name: 'Soekarno-Hatta International Airport' },
  { iata: 'MNL', city: 'Manila',       name: 'Ninoy Aquino International Airport' },
  { iata: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat International Airport' },
  { iata: 'HAN', city: 'Hanoi',        name: 'Noi Bai International Airport' },
  { iata: 'DPS', city: 'Bali',         name: 'Ngurah Rai International Airport' },
  { iata: 'RGN', city: 'Yangon',       name: 'Yangon International Airport' },
  { iata: 'PNH', city: 'Phnom Penh',   name: 'Phnom Penh International Airport' },
  { iata: 'HKT', city: 'Phuket',       name: 'Phuket International Airport' },
  { iata: 'CNX', city: 'Chiang Mai',   name: 'Chiang Mai International Airport' },
  { iata: 'LGK', city: 'Langkawi',     name: 'Langkawi International Airport' },
  { iata: 'PEN', city: 'Penang',       name: 'Penang International Airport' },
  { iata: 'CEB', city: 'Cebu',         name: 'Mactan-Cebu International Airport' },
  // ── East Asia ──────────────────────────────────────────────────
  { iata: 'HKG', city: 'Hong Kong',    name: 'Hong Kong International Airport' },
  { iata: 'NRT', city: 'Tokyo',        name: 'Narita International Airport' },
  { iata: 'KIX', city: 'Osaka',        name: 'Kansai International Airport' },
  { iata: 'ICN', city: 'Seoul',        name: 'Incheon International Airport' },
  { iata: 'PEK', city: 'Beijing',      name: 'Beijing Capital International Airport' },
  { iata: 'PVG', city: 'Shanghai',     name: 'Shanghai Pudong International Airport' },
  { iata: 'CAN', city: 'Guangzhou',    name: 'Guangzhou Baiyun International Airport' },
  { iata: 'TPE', city: 'Taipei',       name: 'Taiwan Taoyuan International Airport' },
  { iata: 'MFM', city: 'Macau',        name: 'Macau International Airport' },
  { iata: 'FUK', city: 'Fukuoka',      name: 'Fukuoka Airport' },
  { iata: 'NGO', city: 'Nagoya',       name: 'Chubu Centrair International Airport' },
  { iata: 'OKA', city: 'Okinawa',      name: 'Naha Airport' },
  { iata: 'CTU', city: 'Chengdu',      name: 'Chengdu Tianfu International Airport' },
  { iata: 'KMG', city: 'Kunming',      name: 'Kunming Changshui International Airport' },
  { iata: 'XIY', city: 'Xi\'an',       name: 'Xi\'an Xianyang International Airport' },
  // ── Europe ─────────────────────────────────────────────────────
  { iata: 'LHR', city: 'London',       name: 'Heathrow Airport' },
  { iata: 'LGW', city: 'London Gatwick', name: 'Gatwick Airport' },
  { iata: 'CDG', city: 'Paris',        name: 'Charles de Gaulle Airport' },
  { iata: 'FRA', city: 'Frankfurt',    name: 'Frankfurt Airport' },
  { iata: 'MUC', city: 'Munich',       name: 'Munich Airport' },
  { iata: 'AMS', city: 'Amsterdam',    name: 'Amsterdam Airport Schiphol' },
  { iata: 'MAD', city: 'Madrid',       name: 'Adolfo Suárez Madrid-Barajas Airport' },
  { iata: 'BCN', city: 'Barcelona',    name: 'Barcelona-El Prat Airport' },
  { iata: 'FCO', city: 'Rome',         name: 'Leonardo da Vinci International Airport' },
  { iata: 'MXP', city: 'Milan',        name: 'Milan Malpensa Airport' },
  { iata: 'ZRH', city: 'Zurich',       name: 'Zurich Airport' },
  { iata: 'VIE', city: 'Vienna',       name: 'Vienna International Airport' },
  { iata: 'CPH', city: 'Copenhagen',   name: 'Copenhagen Airport' },
  { iata: 'ARN', city: 'Stockholm',    name: 'Stockholm Arlanda Airport' },
  { iata: 'OSL', city: 'Oslo',         name: 'Oslo Gardermoen Airport' },
  { iata: 'HEL', city: 'Helsinki',     name: 'Helsinki-Vantaa Airport' },
  { iata: 'WAW', city: 'Warsaw',       name: 'Warsaw Chopin Airport' },
  { iata: 'BUD', city: 'Budapest',     name: 'Budapest Ferenc Liszt International Airport' },
  { iata: 'PRG', city: 'Prague',       name: 'Václav Havel Airport Prague' },
  { iata: 'DUB', city: 'Dublin',       name: 'Dublin Airport' },
  { iata: 'LIS', city: 'Lisbon',       name: 'Humberto Delgado Airport' },
  { iata: 'ATH', city: 'Athens',       name: 'Athens International Airport' },
  { iata: 'BRU', city: 'Brussels',     name: 'Brussels Airport' },
  { iata: 'SVO', city: 'Moscow',       name: 'Sheremetyevo International Airport' },
  { iata: 'GVA', city: 'Geneva',       name: 'Geneva Airport' },
  { iata: 'EDI', city: 'Edinburgh',    name: 'Edinburgh Airport' },
  { iata: 'MAN', city: 'Manchester',   name: 'Manchester Airport' },
  { iata: 'NCE', city: 'Nice',         name: 'Nice Côte d\'Azur Airport' },
  { iata: 'BER', city: 'Berlin',       name: 'Berlin Brandenburg Airport' },
  { iata: 'HAM', city: 'Hamburg',      name: 'Hamburg Airport' },
  { iata: 'DUS', city: 'Düsseldorf',   name: 'Düsseldorf Airport' },
  { iata: 'STR', city: 'Stuttgart',    name: 'Stuttgart Airport' },
  { iata: 'NAP', city: 'Naples',       name: 'Naples International Airport' },
  { iata: 'LYS', city: 'Lyon',         name: 'Lyon Saint-Exupéry Airport' },
  { iata: 'PMI', city: 'Palma de Mallorca', name: 'Palma de Mallorca Airport' },
  { iata: 'AGP', city: 'Malaga',       name: 'Málaga-Costa del Sol Airport' },
  // ── North America ──────────────────────────────────────────────
  { iata: 'JFK', city: 'New York',     name: 'John F. Kennedy International Airport' },
  { iata: 'LAX', city: 'Los Angeles',  name: 'Los Angeles International Airport' },
  { iata: 'ORD', city: 'Chicago',      name: "O'Hare International Airport" },
  { iata: 'ATL', city: 'Atlanta',      name: 'Hartsfield-Jackson Atlanta International Airport' },
  { iata: 'DFW', city: 'Dallas',       name: 'Dallas/Fort Worth International Airport' },
  { iata: 'DEN', city: 'Denver',       name: 'Denver International Airport' },
  { iata: 'SFO', city: 'San Francisco', name: 'San Francisco International Airport' },
  { iata: 'SEA', city: 'Seattle',      name: 'Seattle-Tacoma International Airport' },
  { iata: 'BOS', city: 'Boston',       name: 'Logan International Airport' },
  { iata: 'MIA', city: 'Miami',        name: 'Miami International Airport' },
  { iata: 'YYZ', city: 'Toronto',      name: 'Toronto Pearson International Airport' },
  { iata: 'YVR', city: 'Vancouver',    name: 'Vancouver International Airport' },
  { iata: 'YUL', city: 'Montreal',     name: 'Montréal-Trudeau International Airport' },
  { iata: 'MEX', city: 'Mexico City',  name: 'Benito Juárez International Airport' },
  { iata: 'LAS', city: 'Las Vegas',   name: 'Harry Reid International Airport' },
  { iata: 'PHX', city: 'Phoenix',     name: 'Phoenix Sky Harbor International Airport' },
  { iata: 'MSP', city: 'Minneapolis', name: 'Minneapolis-Saint Paul International Airport' },
  { iata: 'DTW', city: 'Detroit',     name: 'Detroit Metropolitan Wayne County Airport' },
  { iata: 'EWR', city: 'Newark',      name: 'Newark Liberty International Airport' },
  { iata: 'IAD', city: 'Washington DC', name: 'Dulles International Airport' },
  { iata: 'IAH', city: 'Houston',     name: 'George Bush Intercontinental Airport' },
  { iata: 'CLT', city: 'Charlotte',   name: 'Charlotte Douglas International Airport' },
  { iata: 'MCO', city: 'Orlando',     name: 'Orlando International Airport' },
  { iata: 'SAN', city: 'San Diego',   name: 'San Diego International Airport' },
  // ── South America ──────────────────────────────────────────────
  { iata: 'GRU', city: 'São Paulo',    name: 'São Paulo/Guarulhos International Airport' },
  { iata: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini International Airport' },
  { iata: 'BOG', city: 'Bogotá',       name: 'El Dorado International Airport' },
  { iata: 'SCL', city: 'Santiago',     name: 'Arturo Merino Benítez International Airport' },
  { iata: 'LIM', city: 'Lima',         name: 'Jorge Chávez International Airport' },
  { iata: 'GIG', city: 'Rio de Janeiro', name: 'Rio de Janeiro-Galeão International Airport' },
  { iata: 'CCS', city: 'Caracas',      name: 'Simón Bolívar International Airport' },
  { iata: 'UIO', city: 'Quito',        name: 'Mariscal Sucre International Airport' },
  { iata: 'MVD', city: 'Montevideo',   name: 'Carrasco International Airport' },
  { iata: 'MDE', city: 'Medellín',     name: 'José María Córdova International Airport' },
  // ── Africa ─────────────────────────────────────────────────────
  { iata: 'CAI', city: 'Cairo',        name: 'Cairo International Airport' },
  { iata: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo International Airport' },
  { iata: 'CPT', city: 'Cape Town',    name: 'Cape Town International Airport' },
  { iata: 'NBO', city: 'Nairobi',      name: 'Jomo Kenyatta International Airport' },
  { iata: 'ADD', city: 'Addis Ababa',  name: 'Bole International Airport' },
  { iata: 'LOS', city: 'Lagos',        name: 'Murtala Muhammed International Airport' },
  { iata: 'ACC', city: 'Accra',        name: 'Kotoka International Airport' },
  { iata: 'CMN', city: 'Casablanca',   name: 'Mohammed V International Airport' },
  { iata: 'DAR', city: 'Dar es Salaam', name: 'Julius Nyerere International Airport' },
  { iata: 'EBB', city: 'Entebbe',      name: 'Entebbe International Airport' },
  { iata: 'HRE', city: 'Harare',       name: 'Robert Gabriel Mugabe International Airport' },
  { iata: 'DKR', city: 'Dakar',        name: 'Léopold Sédar Senghor International Airport' },
  { iata: 'ABJ', city: 'Abidjan',      name: 'Félix-Houphouët-Boigny International Airport' },
  { iata: 'TUN', city: 'Tunis',        name: 'Tunis-Carthage International Airport' },
  { iata: 'ALG', city: 'Algiers',      name: 'Houari Boumediene Airport' },
  // ── Australia & Pacific ────────────────────────────────────────
  { iata: 'SYD', city: 'Sydney',       name: 'Sydney Kingsford Smith Airport' },
  { iata: 'MEL', city: 'Melbourne',    name: 'Melbourne Airport' },
  { iata: 'BNE', city: 'Brisbane',     name: 'Brisbane Airport' },
  { iata: 'PER', city: 'Perth',        name: 'Perth Airport' },
  { iata: 'ADL', city: 'Adelaide',     name: 'Adelaide Airport' },
  { iata: 'AKL', city: 'Auckland',     name: 'Auckland Airport' },
  { iata: 'CHC', city: 'Christchurch', name: 'Christchurch Airport' },
  { iata: 'CNS', city: 'Cairns',       name: 'Cairns Airport' },
  { iata: 'OOL', city: 'Gold Coast',   name: 'Gold Coast Airport' },
  { iata: 'HBA', city: 'Hobart',       name: 'Hobart Airport' },
  { iata: 'DRW', city: 'Darwin',       name: 'Darwin International Airport' },
  { iata: 'WLG', city: 'Wellington',   name: 'Wellington International Airport' },
];

const POPULAR_ROUTES = [
  { from: 'DEL', to: 'BOM', fromCity: 'Delhi',     toCity: 'Mumbai',    price: 4299 },
  { from: 'BOM', to: 'BLR', fromCity: 'Mumbai',    toCity: 'Bengaluru', price: 3799 },
  { from: 'DEL', to: 'GOI', fromCity: 'Delhi',     toCity: 'Goa',       price: 5499 },
  { from: 'BLR', to: 'DEL', fromCity: 'Bengaluru', toCity: 'Delhi',     price: 4599 },
  { from: 'MAA', to: 'DXB', fromCity: 'Chennai',   toCity: 'Dubai',     price: 18999 },
  { from: 'DEL', to: 'LHR', fromCity: 'Delhi',     toCity: 'London',    price: 62999 },
];

const BG_SCENES = [
  // Dawn — warm orange horizon fading into deep blue sky
  'linear-gradient(160deg, #0f2044 0%, #1a3a6b 30%, #c0512f 70%, #e8834a 100%)',
  // Daytime — bright sky blue with cloud-white glow
  'linear-gradient(160deg, #0369a1 0%, #0ea5e9 40%, #7dd3fc 70%, #e0f2fe 100%)',
  // Sunset — purple-pink horizon bleeding into deep indigo
  'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 30%, #be185d 65%, #f97316 100%)',
  // Night — deep navy starfield with blue-purple shimmer
  'linear-gradient(160deg, #020617 0%, #0f172a 35%, #1e3a5f 65%, #0c4a6e 100%)',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [bgIdx, setBgIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIdx(i => (i + 1) % BG_SCENES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const [form, setForm] = useState<FlightSearchRequest>({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: 1,
    cabinClass: 'ECONOMY',
    tripType: 'ONE_WAY',
  });

  const [originText, setOriginText] = useState('');
  const [destText, setDestText] = useState('');
  const [showOriginDrop, setShowOriginDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);

  const filterAirports = (text: string) =>
    AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(text.toLowerCase()) ||
      a.iata.toLowerCase().includes(text.toLowerCase()) ||
      a.name.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 6);

  const set = (field: keyof FlightSearchRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let origin = form.origin;
    let destination = form.destination;
    if (!origin && originText) {
      const match = AIRPORTS.find(a =>
        a.iata.toLowerCase() === originText.toLowerCase() ||
        a.city.toLowerCase() === originText.toLowerCase()
      ) ?? filterAirports(originText)[0];
      if (match) { origin = match.iata; setForm(p => ({ ...p, origin: match.iata })); }
    }
    if (!destination && destText) {
      const match = AIRPORTS.find(a =>
        a.iata.toLowerCase() === destText.toLowerCase() ||
        a.city.toLowerCase() === destText.toLowerCase()
      ) ?? filterAirports(destText)[0];
      if (match) { destination = match.iata; setForm(p => ({ ...p, destination: match.iata })); }
    }
    if (!origin || !destination) return;
    const params = new URLSearchParams({
      origin:        origin.toUpperCase(),
      destination:   destination.toUpperCase(),
      departureDate: form.departureDate,
      passengers:    String(form.passengers),
      cabinClass:    form.cabinClass,
      tripType:      form.tripType,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '540px' }}>
        {/* Rotating sky backgrounds */}
        {BG_SCENES.map((scene, i) => (
          <div key={i} className="absolute inset-0 w-full h-full"
            style={{ background: scene, opacity: i === bgIdx ? 1 : 0, transition: 'opacity 1.5s ease-in-out' }} />
        ))}

        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        {/* Animated flight path */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full opacity-10" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path d="M-100,350 Q300,50 700,200 Q1000,320 1300,100" stroke="white" strokeWidth="1.5"
              fill="none" strokeDasharray="8 6" />
          </svg>
          <div style={{
            position: 'absolute', fontSize: '28px',
            animation: 'flyAcross 12s linear infinite',
          }}>✈</div>
        </div>

        <style>{`
          @keyframes flyAcross {
            0%   { left: -60px; top: 78%; opacity: 0; }
            5%   { opacity: 1; }
            95%  { opacity: 1; }
            100% { left: 110%; top: 28%; opacity: 0; }
          }
        `}</style>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-36">
          <p className="text-sky-300 font-semibold text-sm uppercase tracking-widest mb-3">
            ✈ &nbsp;Your journey starts here
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5 drop-shadow-lg">
            Fly Anywhere.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">
              Book Smarter.
            </span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl leading-relaxed mb-8">
            Search thousands of flights worldwide. Get instant confirmation delivered to your inbox.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6">
            {[
              { value: '150+', label: 'Destinations' },
              { value: '500+', label: 'Routes' },
              { value: '24/7', label: 'Support' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-start">
                <span className="text-2xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs text-blue-200 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search card */}
      <section id="search-flights" className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Search Flights</h2>

          <div className="flex gap-2 mb-5">
            {(['ONE_WAY', 'ROUND_TRIP'] as const).map((t) => (
              <button key={t} type="button"
                onClick={() => setForm((p) => ({ ...p, tripType: t }))}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  form.tripType === t ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {t === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="relative">
                <label className="label">From</label>
                <input className="input" value={originText}
                  onChange={(e) => { setOriginText(e.target.value); setForm((p) => ({ ...p, origin: '' })); setShowOriginDrop(true); }}
                  onFocus={() => setShowOriginDrop(true)}
                  onBlur={() => setTimeout(() => setShowOriginDrop(false), 150)}
                  placeholder="City or airport" autoComplete="off" required />
                {showOriginDrop && originText.length > 0 && filterAirports(originText).length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                    {filterAirports(originText).map((a) => (
                      <button key={a.iata} type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        onMouseDown={() => { setOriginText(a.city); setForm((p) => ({ ...p, origin: a.iata })); setShowOriginDrop(false); }}>
                        <span className="font-bold text-brand-600 text-sm w-10 shrink-0">{a.iata}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{a.city}</p>
                          <p className="text-xs text-gray-400">{a.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="label">To</label>
                <input className="input" value={destText}
                  onChange={(e) => { setDestText(e.target.value); setForm((p) => ({ ...p, destination: '' })); setShowDestDrop(true); }}
                  onFocus={() => setShowDestDrop(true)}
                  onBlur={() => setTimeout(() => setShowDestDrop(false), 150)}
                  placeholder="City or airport" autoComplete="off" required />
                {showDestDrop && destText.length > 0 && filterAirports(destText).length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                    {filterAirports(destText).map((a) => (
                      <button key={a.iata} type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        onMouseDown={() => { setDestText(a.city); setForm((p) => ({ ...p, destination: a.iata })); setShowDestDrop(false); }}>
                        <span className="font-bold text-brand-600 text-sm w-10 shrink-0">{a.iata}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{a.city}</p>
                          <p className="text-xs text-gray-400">{a.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Departure Date</label>
                <input className="input" type="date" value={form.departureDate} onChange={set('departureDate')}
                  min={new Date().toISOString().split('T')[0]} required />
              </div>

              {form.tripType === 'ROUND_TRIP' && (
                <div>
                  <label className="label">Return Date</label>
                  <input className="input" type="date" value={form.returnDate ?? ''} onChange={set('returnDate')}
                    min={form.departureDate || new Date().toISOString().split('T')[0]} />
                </div>
              )}

              <div>
                <label className="label">Passengers</label>
                <input className="input" type="number" value={form.passengers} onChange={set('passengers')} min={1} max={9} required />
              </div>

              <div>
                <label className="label">Cabin Class</label>
                <select className="input" value={form.cabinClass} onChange={set('cabinClass')}>
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary mt-5 w-full sm:w-auto px-10">
              Search Flights ✈
            </button>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { city: 'Dubai',     iata: 'DXB', from: 'DEL', img: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { city: 'Singapore', iata: 'SIN', from: 'BOM', img: 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { city: 'London',    iata: 'LHR', from: 'DEL', img: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { city: 'Paris',     iata: 'CDG', from: 'DEL', img: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { city: 'Bangkok',   iata: 'BKK', from: 'BOM', img: 'https://images.pexels.com/photos/1031645/pexels-photo-1031645.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
            { city: 'Bali',      iata: 'DPS', from: 'DEL', img: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
          ].map((dest) => (
            <button
              key={dest.iata}
              onClick={() => {
                const params = new URLSearchParams({
                  origin: dest.from, destination: dest.iata,
                  departureDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                  passengers: '1', cabinClass: 'ECONOMY', tripType: 'ONE_WAY',
                });
                navigate(`/search?${params.toString()}`);
              }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer h-36 sm:h-44"
            >
              <img
                src={dest.img}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-left">
                <p className="text-white font-bold text-sm drop-shadow">{dest.city}</p>
                <p className="text-white/70 text-xs">{dest.iata}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
            <p className="text-sm text-gray-500 mt-0.5">Handpicked deals on top-travelled routes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route) => {
            const c = { bg: 'from-blue-600 to-sky-400', badge: 'bg-blue-100 text-blue-700' };
            return (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => {
                  const params = new URLSearchParams({
                    origin: route.from, destination: route.to,
                    departureDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                    passengers: '1', cabinClass: 'ECONOMY', tripType: 'ONE_WAY',
                  });
                  navigate(`/search?${params.toString()}`);
                }}
                className="group relative rounded-2xl overflow-hidden text-left transition-transform hover:-translate-y-1 hover:shadow-xl duration-200"
              >
                {/* Gradient strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${c.bg}`} />
                <div className="bg-white border border-gray-100 rounded-b-2xl p-5">
                  {/* Route */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.badge}`}>{route.from}</span>
                    <span className="text-gray-300 text-lg">✈</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.badge}`}>{route.to}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                        {route.fromCity} → {route.toCity}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Non-stop · Economy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">from</p>
                      <p className="text-xl font-extrabold text-blue-600">₹{route.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Why SkyWays */}
      <section className="mt-20 py-20" style={{ background: '#1e1b4b' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-2">Why SkyWays?</h2>
            <p className="text-blue-300 text-sm">Everything you need for a seamless journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💰', color: 'from-yellow-400 to-orange-400', title: 'Best Prices', desc: 'Competitive fares across thousands of routes worldwide' },
              { icon: '🔒', color: 'from-green-400 to-emerald-500', title: 'Secure Payments', desc: 'Bank-grade encryption on every transaction' },
              { icon: '⚡', color: 'from-blue-400 to-sky-500',      title: 'Instant Confirmation', desc: 'Booking confirmation delivered to your inbox instantly' },
              { icon: '↩️', color: 'from-purple-400 to-violet-500', title: 'Easy Cancellations', desc: 'Hassle-free refunds processed automatically' },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
