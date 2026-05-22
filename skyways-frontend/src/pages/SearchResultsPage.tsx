import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { flightApi } from '../api/flightApi';
import FlightCard from '../components/FlightCard';
import Spinner from '../components/Spinner';
import type { FlightDto, FlightSearchRequest } from '../types';

type SortKey = 'price' | 'duration' | 'departure';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();

  const req: FlightSearchRequest = {
    origin:        searchParams.get('origin') ?? '',
    destination:   searchParams.get('destination') ?? '',
    departureDate: searchParams.get('departureDate') ?? '',
    passengers:    Number(searchParams.get('passengers') ?? 1),
    cabinClass:    (searchParams.get('cabinClass') as FlightSearchRequest['cabinClass']) ?? 'ECONOMY',
    tripType:      (searchParams.get('tripType') as FlightSearchRequest['tripType']) ?? 'ONE_WAY',
  };

  const [flights, setFlights] = useState<FlightDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [filterStops, setFilterStops] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!req.origin || !req.destination || !req.departureDate) return;
    setLoading(true);
    setError('');
    try {
      const data = await flightApi.search(req);
      setFlights(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const sorted = [...flights]
    .filter((f) => filterStops === null || f.stops === filterStops)
    .sort((a, b) => {
      if (sortBy === 'price')     return a.basePrice - b.basePrice;
      if (sortBy === 'duration')  return a.durationMinutes - b.durationMinutes;
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {req.origin} → {req.destination}
          </h1>
          <p className="text-sm text-gray-500">
            {req.departureDate} &bull; {req.passengers} passenger{req.passengers > 1 ? 's' : ''} &bull; {req.cabinClass}
          </p>
        </div>
        {!loading && (
          <span className="text-sm text-gray-500">{sorted.length} flight{sorted.length !== 1 ? 's' : ''} found</span>
        )}
      </div>

      {/* Filters & sort */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Sort:</label>
          {(['price', 'duration', 'departure'] as SortKey[]).map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                sortBy === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <label className="text-xs font-medium text-gray-600">Stops:</label>
          {[null, 0, 1].map((s) => (
            <button key={String(s)} onClick={() => setFilterStops(s === filterStops ? null : s)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                filterStops === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {s === null ? 'Any' : s === 0 ? 'Non-stop' : '1 Stop'}
            </button>
          ))}
        </div>

      </div>

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center py-20 gap-4">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">Searching GDS &amp; Skyscanner for the best fares…</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-600 font-medium">No flights found for this route and date.</p>
          <p className="text-gray-400 text-sm mt-1">Try different dates or nearby airports.</p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="space-y-4">
          {sorted.map((flight) => (
            <FlightCard key={flight.flightId} flight={flight} passengers={req.passengers} tripType={req.tripType} />
          ))}
        </div>
      )}
    </div>
  );
}
