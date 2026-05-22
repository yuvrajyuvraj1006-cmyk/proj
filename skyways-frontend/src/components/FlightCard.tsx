import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import type { FlightDto } from '../types';

interface Props {
  flight: FlightDto;
  passengers: number;
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function seatBadge(seats: number): { label: string; classes: string } {
  if (seats > 20) return { label: `${seats} seats`, classes: 'bg-green-100 text-green-700' };
  if (seats > 5)  return { label: `${seats} seats left`, classes: 'bg-yellow-100 text-yellow-700' };
  return { label: `${seats} seat${seats !== 1 ? 's' : ''} left!`, classes: 'bg-red-100 text-red-700' };
}

export default function FlightCard({ flight, passengers, tripType = 'ONE_WAY' }: Props) {
  const navigate = useNavigate();
  const isRoundTrip = tripType === 'ROUND_TRIP';
  const totalPrice = flight.basePrice * passengers * (isRoundTrip ? 2 : 1);

  const dep = parseISO(flight.departureTime);
  const arr = parseISO(flight.arrivalTime);

  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Airline info */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
            {flight.airlineCode || flight.airlineName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{flight.airlineName}</p>
            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Route + times */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{format(dep, 'HH:mm')}</p>
            <p className="text-xs font-semibold text-gray-600">{flight.originIata}</p>
            <p className="text-xs text-gray-400 hidden sm:block">{flight.originCity}</p>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 max-w-[120px]">
            <p className="text-xs text-gray-400">{formatDuration(flight.durationMinutes)}</p>
            <div className="w-full flex items-center gap-1">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-300 text-xs">✈</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{format(arr, 'HH:mm')}</p>
            <p className="text-xs font-semibold text-gray-600">{flight.destinationIata}</p>
            <p className="text-xs text-gray-400 hidden sm:block">{flight.destinationCity}</p>
          </div>
        </div>

        {/* Price + book */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 sm:min-w-[130px]">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {flight.currency} {totalPrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              {passengers} passenger{passengers > 1 ? 's' : ''}{isRoundTrip ? ' · Round trip' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(() => { const b = seatBadge(flight.availableSeats); return <span className={`badge ${b.classes}`}>{b.label}</span>; })()}
            <button
              onClick={() => navigate(`/booking/${flight.flightId}`, { state: { flight, passengers, tripType } })}
              className="btn-primary py-2 px-4 text-xs"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Seats warning */}
      {flight.availableSeats <= 5 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-red-600 font-medium">
            Only {flight.availableSeats} seat{flight.availableSeats !== 1 ? 's' : ''} left!
          </p>
        </div>
      )}
    </div>
  );
}
