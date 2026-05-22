import React, { useState } from 'react';
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
  // ── South America ──────────────────────────────────────────────
  { iata: 'GRU', city: 'São Paulo',    name: 'São Paulo/Guarulhos International Airport' },
  { iata: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini International Airport' },
  { iata: 'BOG', city: 'Bogotá',       name: 'El Dorado International Airport' },
  { iata: 'SCL', city: 'Santiago',     name: 'Arturo Merino Benítez International Airport' },
  { iata: 'LIM', city: 'Lima',         name: 'Jorge Chávez International Airport' },
  { iata: 'GIG', city: 'Rio de Janeiro', name: 'Rio de Janeiro-Galeão International Airport' },
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
  // ── Australia & Pacific ────────────────────────────────────────
  { iata: 'SYD', city: 'Sydney',       name: 'Sydney Kingsford Smith Airport' },
  { iata: 'MEL', city: 'Melbourne',    name: 'Melbourne Airport' },
  { iata: 'BNE', city: 'Brisbane',     name: 'Brisbane Airport' },
  { iata: 'PER', city: 'Perth',        name: 'Perth Airport' },
  { iata: 'ADL', city: 'Adelaide',     name: 'Adelaide Airport' },
  { iata: 'AKL', city: 'Auckland',     name: 'Auckland Airport' },
  { iata: 'CHC', city: 'Christchurch', name: 'Christchurch Airport' },
];

const POPULAR_ROUTES = [
  { from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', price: 2499 },
  { from: 'BOM', to: 'BLR', fromCity: 'Mumbai', toCity: 'Bengaluru', price: 1899 },
  { from: 'DEL', to: 'GOI', fromCity: 'Delhi', toCity: 'Goa', price: 3199 },
  { from: 'HYD', to: 'DEL', fromCity: 'Hyderabad', toCity: 'Delhi', price: 2799 },
  { from: 'BLR', to: 'CCU', fromCity: 'Bengaluru', toCity: 'Kolkata', price: 3499 },
  { from: 'COK', to: 'DXB', fromCity: 'Kochi', toCity: 'Dubai', price: 8999 },
];

export default function HomePage() {
  const navigate = useNavigate();

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
      <section className="relative bg-gradient-to-br from-brand-800 via-brand-700 to-sky-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
            Fly Anywhere.<br />
            <span className="text-sky-300">Book Smarter.</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Search thousands of flights to destinations worldwide. Pay securely with Razorpay.
            Get instant confirmation delivered to your inbox.
          </p>
        </div>
      </section>

      {/* Search card — overlaps hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Search Flights</h2>

          {/* Trip type toggle */}
          <div className="flex gap-2 mb-5">
            {(['ONE_WAY', 'ROUND_TRIP'] as const).map((t) => (
              <button key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, tripType: t }))}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  form.tripType === t
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {t === 'ONE_WAY' ? 'One Way' : 'Round Trip'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="relative">
                <label className="label">From</label>
                <input
                  className="input"
                  value={originText}
                  onChange={(e) => {
                    setOriginText(e.target.value);
                    setForm((prev) => ({ ...prev, origin: '' }));
                    setShowOriginDrop(true);
                  }}
                  onFocus={() => setShowOriginDrop(true)}
                  onBlur={() => setTimeout(() => setShowOriginDrop(false), 150)}
                  placeholder="City or airport"
                  autoComplete="off"
                  required
                />
                {showOriginDrop && originText.length > 0 && filterAirports(originText).length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                    {filterAirports(originText).map((a) => (
                      <button
                        key={a.iata}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        onMouseDown={() => {
                          setOriginText(a.city);
                          setForm((prev) => ({ ...prev, origin: a.iata }));
                          setShowOriginDrop(false);
                        }}
                      >
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
                <input
                  className="input"
                  value={destText}
                  onChange={(e) => {
                    setDestText(e.target.value);
                    setForm((prev) => ({ ...prev, destination: '' }));
                    setShowDestDrop(true);
                  }}
                  onFocus={() => setShowDestDrop(true)}
                  onBlur={() => setTimeout(() => setShowDestDrop(false), 150)}
                  placeholder="City or airport"
                  autoComplete="off"
                  required
                />
                {showDestDrop && destText.length > 0 && filterAirports(destText).length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                    {filterAirports(destText).map((a) => (
                      <button
                        key={a.iata}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                        onMouseDown={() => {
                          setDestText(a.city);
                          setForm((prev) => ({ ...prev, destination: a.iata }));
                          setShowDestDrop(false);
                        }}
                      >
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
                <input className="input" type="date" value={form.departureDate}
                  onChange={set('departureDate')}
                  min={new Date().toISOString().split('T')[0]}
                  required />
              </div>

              {form.tripType === 'ROUND_TRIP' && (
                <div>
                  <label className="label">Return Date</label>
                  <input className="input" type="date" value={form.returnDate ?? ''}
                    onChange={set('returnDate')}
                    min={form.departureDate || new Date().toISOString().split('T')[0]} />
                </div>
              )}

              <div>
                <label className="label">Passengers</label>
                <input className="input" type="number" value={form.passengers}
                  onChange={set('passengers')} min={1} max={9} required />
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

      {/* Popular routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_ROUTES.map((route) => (
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
              className="card hover:shadow-card-hover transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-lg group-hover:text-brand-600 transition-colors">
                    {route.fromCity} → {route.toCity}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{route.from} → {route.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-600">₹{route.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">from</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Why SkyWays */}
      <section className="bg-gray-100 mt-16 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why SkyWays?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔍', title: 'Best Prices', desc: 'Competitive fares across thousands of routes worldwide' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay-powered with 3-DES encrypted PII storage' },
              { icon: '📧', title: 'Instant Confirmation', desc: 'Booking confirmed via SendGrid email in seconds' },
              { icon: '♻️', title: 'Easy Cancellations', desc: 'SAGA-orchestrated refunds with automatic notifications' },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
