import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { FlightDto } from '../types';

const ROWS = 30;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

function isOccupied(row: number, col: string, seed: string): boolean {
  const val = (row * 37 + col.charCodeAt(0) * 13 + seed.charCodeAt(0)) % 10;
  return val < 3;
}

function getSeatClass(row: number, col: string, seed: string, selected: string[]): string {
  const id = `${row}${col}`;
  if (isOccupied(row, col, seed)) return 'bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300';
  if (selected.includes(id)) return 'bg-brand-600 text-white border-brand-600 cursor-pointer';
  return 'bg-white text-gray-700 border-gray-300 hover:border-brand-500 hover:bg-brand-50 cursor-pointer';
}

export default function SeatSelectionPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    bookingRef?: string;
    flight?: FlightDto;
    totalAmount?: number;
    currency?: string;
    passengerCount?: number;
  } | undefined;

  const bookingRef     = state?.bookingRef ?? '';
  const flight         = state?.flight;
  const totalAmount    = state?.totalAmount ?? 0;
  const currency       = state?.currency ?? 'INR';
  const passengerCount = state?.passengerCount ?? 1;
  const seed           = bookingId ?? 'default';

  const [selected, setSelected] = useState<string[]>([]);

  const handleSeat = (row: number, col: string) => {
    if (isOccupied(row, col, seed)) return;
    const id = `${row}${col}`;
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= passengerCount) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    navigate(`/payment/${bookingId}`, {
      state: { bookingRef, flight, totalAmount, currency },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Select Your Seat</h1>
      {flight && (
        <p className="text-sm text-gray-500 mb-6">
          {flight.originIata} → {flight.destinationIata} &bull; {flight.flightNumber} &bull; {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
        </p>
      )}

      {/* Legend */}
      <div className="flex gap-5 mb-6 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded border border-gray-300 bg-white inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded border border-brand-600 bg-brand-600 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded border border-gray-300 bg-gray-300 inline-block" />
          Occupied
        </span>
      </div>

      {/* Column headers */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex items-center mb-1 pl-8">
            {COLS.map((col, i) => (
              <React.Fragment key={col}>
                {i === 3 && <div className="w-6" />}
                <div className="w-9 text-center text-xs font-semibold text-gray-400">{col}</div>
              </React.Fragment>
            ))}
          </div>

          {/* Seat rows */}
          <div className="space-y-1">
            {Array.from({ length: ROWS }, (_, i) => i + 1).map(row => (
              <div key={row} className="flex items-center gap-0">
                <div className="w-8 text-xs text-gray-400 text-right pr-2 shrink-0">{row}</div>
                {COLS.map((col, i) => (
                  <React.Fragment key={col}>
                    {i === 3 && <div className="w-6" />}
                    <button
                      onClick={() => handleSeat(row, col)}
                      disabled={isOccupied(row, col, seed)}
                      className={`w-9 h-8 text-xs font-medium rounded border transition-colors mx-0.5 ${getSeatClass(row, col, seed, selected)}`}
                    >
                      {selected.includes(`${row}${col}`) ? '✓' : ''}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 card bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Selected: <span className="text-brand-700 font-semibold">{selected.join(', ') || '—'}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {selected.length}/{passengerCount} seat{passengerCount > 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">{currency} {totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={() => navigate(-1)} className="btn-secondary flex-1">
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className="btn-primary flex-1"
        >
          {selected.length === 0
            ? 'Select a seat to continue'
            : `Confirm Seat${selected.length > 1 ? 's' : ''} → Payment`}
        </button>
      </div>
    </div>
  );
}
