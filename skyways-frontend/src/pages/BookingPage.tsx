import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import PassengerForm from '../components/PassengerForm';
import Spinner from '../components/Spinner';
import type { FlightDto, PassengerInput } from '../types';

function emptyPassenger(): PassengerInput {
  return { firstName: '', lastName: '', dateOfBirth: '', passportNumber: '', nationality: '' };
}

export default function BookingPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const state = location.state as { flight: FlightDto; passengers: number; tripType?: string } | undefined;
  const flight     = state?.flight;
  const passengerCount = state?.passengers ?? 1;
  const tripType   = state?.tripType ?? 'ONE_WAY';
  const isRoundTrip = tripType === 'ROUND_TRIP';

  const [passengers, setPassengers] = useState<PassengerInput[]>(
    Array.from({ length: passengerCount }, emptyPassenger)
  );
  const [contactEmail, setContactEmail] = useState(user?.email ?? '');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updatePassenger = (i: number, field: keyof PassengerInput, val: string) => {
    setPassengers((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightId) return;
    setError('');
    setLoading(true);
    try {
      const safeFlightId = /^mock-([^-]+)-(\d+)$/.test(flightId)
        ? (() => { const m = flightId.match(/^mock-([^-]+)-(\d+)$/)!; const hex = m[1].split('').map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(''); return `00000000-0000-4000-8000-${hex}${m[2].padStart(8,'0')}`; })()
        : flightId;
      const result = await bookingApi.create({
        flightId: safeFlightId,
        cabinClass: flight?.cabinClass ?? 'ECONOMY',
        totalAmount,
        currency: flight?.currency ?? 'INR',
        passengers,
        contactEmail,
        contactPhone,
      });
      navigate(`/seats/${result.bookingId}`, { state: { bookingRef: result.bookingRef, flight, totalAmount, currency: flight?.currency ?? 'INR', passengerCount } });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Flight details not found. Please search again.</p>
        <button onClick={() => navigate('/search')} className="btn-primary mt-4">Back to Search</button>
      </div>
    );
  }

  const dep = parseISO(flight.departureTime);
  const arr = parseISO(flight.arrivalTime);
  const totalAmount = flight.basePrice * passengerCount * (isRoundTrip ? 2 : 1);
  const totalPrice = totalAmount.toLocaleString();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

      {/* Flight summary */}
      <div className="card mb-6 bg-brand-50 border-brand-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-gray-900 text-lg">
              {flight.originIata} → {flight.destinationIata}
            </p>
            <p className="text-sm text-gray-600">
              {flight.airlineName} &bull; {flight.flightNumber}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {format(dep, 'dd MMM yyyy, HH:mm')} → {format(arr, 'HH:mm')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-700">{flight.currency} {totalPrice}</p>
            <p className="text-xs text-gray-500">{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Passengers */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Passenger Details</h2>
          <div className="space-y-4">
            {passengers.map((p, i) => (
              <PassengerForm key={i} index={i} value={p} onChange={updatePassenger} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Contact Information</h2>
          <p className="text-xs text-gray-500 mb-4">
            Booking confirmation will be sent to this email via SendGrid.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email Address *</label>
              <input className="input" type="email" value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input className="input" type="tel" value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210" required />
            </div>
          </div>
        </section>

        {/* Price summary */}
        <div className="card bg-gray-50">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Base fare × {passengerCount}{isRoundTrip ? ' × 2 (round trip)' : ''}</span>
            <span>{flight.currency} {totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Taxes &amp; fees</span>
            <span className="text-green-600">Included</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-200 pt-2 mt-2">
            <span>Total</span>
            <span>{flight.currency} {totalPrice}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Back
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? 'Creating booking…' : 'Proceed to Payment →'}
          </button>
        </div>
      </form>
    </div>
  );
}
