import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../api/bookingApi';
import BookingStatusBadge from '../components/BookingStatusBadge';
import Spinner from '../components/Spinner';
import type { BookingSummary, FlightDto } from '../types';

export default function BookingConfirmationPage() {
  const { bookingRef } = useParams<{ bookingRef: string }>();
  const location = useLocation();
  const state = location.state as { flight?: FlightDto; totalAmount?: number; currency?: string } | undefined;
  const flight = state?.flight;

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!bookingRef) return;
    let attempts = 0;
    const MAX_POLLS = 20;

    const poll = () => {
      bookingApi.getByRef(bookingRef)
        .then((b) => {
          setBooking(b);
          setLoading(false);
          if (b.status !== 'CONFIRMED' && b.status !== 'CANCELLED' && attempts < MAX_POLLS) {
            attempts++;
            setTimeout(poll, 3000);
          }
        })
        .catch((e) => {
          setError(e?.response?.data?.message ?? 'Could not load booking details.');
          setLoading(false);
        });
    };

    poll();
  }, [bookingRef]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-600">{error || 'Booking not found.'}</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const isConfirmed = booking.status === 'CONFIRMED';
  const dep = flight?.departureTime ? parseISO(flight.departureTime) : null;
  const arr = flight?.arrivalTime   ? parseISO(flight.arrivalTime)   : null;
  const totalPaid = state?.totalAmount ?? booking.totalAmount;
  const currency  = state?.currency   ?? booking.currency;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 page-enter">
      {/* Status banner */}
      <div className={`rounded-2xl p-8 text-center mb-8 ${
        isConfirmed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="text-6xl mb-3">{isConfirmed ? '✅' : '⏳'}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isConfirmed ? 'Booking Confirmed!' : 'Payment Successful!'}
        </h1>
        <p className="text-gray-600 text-sm">
          {isConfirmed
            ? 'Your booking is confirmed. A confirmation email has been sent.'
            : 'Your payment was received. Booking confirmation is being processed.'}
        </p>
      </div>

      {/* Booking details */}
      <div className="card mb-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Booking Reference</p>
            <p className="text-2xl font-mono font-bold text-brand-700">{booking.bookingRef ?? bookingRef}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
          {flight && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Route</span>
                <span className="font-semibold">{flight.originIata} → {flight.destinationIata}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Flight</span>
                <span className="font-semibold">{flight.airlineName} · {flight.flightNumber}</span>
              </div>
              {dep && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span>{format(dep, 'dd MMM yyyy, HH:mm')}</span>
                </div>
              )}
              {arr && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Arrival</span>
                  <span>{format(arr, 'HH:mm')}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
            <span>Total Paid</span>
            <span>{currency} {Number(totalPaid).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/my-bookings" className="btn-secondary flex-1 text-center">View All Bookings</Link>
        <Link to="/" className="btn-primary flex-1 text-center">Book Another Flight</Link>
      </div>
    </div>
  );
}
