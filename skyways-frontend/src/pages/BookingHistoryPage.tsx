import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../api/bookingApi';
import BookingStatusBadge from '../components/BookingStatusBadge';
import Spinner from '../components/Spinner';
import type { BookingSummary, PageResponse } from '../types';

export default function BookingHistoryPage() {
  const [page, setPage]             = useState<PageResponse<BookingSummary> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingApi.getMyBookings(p, 10);
      setPage(data);
      setCurrentPage(p);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleCancel = async (bookingRef: string) => {
    if (!window.confirm(`Cancel booking ${bookingRef}? Refund will be processed automatically.`)) return;
    setCancelling(bookingRef);
    try {
      await bookingApi.cancel(bookingRef);
      load(currentPage);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Cancellation failed.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <Link to="/" className="btn-primary py-2 px-4 text-sm">+ New Booking</Link>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      )}

      {!loading && error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {!loading && !error && page?.content.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">✈</p>
          <p className="text-gray-600 font-medium">No bookings yet.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">Search Flights</Link>
        </div>
      )}

      {!loading && !error && page && page.content.length > 0 && (
        <>
          <div className="space-y-4">
            {page.content.map((b) => {
              const dep = b.departureTime ? parseISO(b.departureTime) : null;
              const canCancel = ['INITIATED', 'SEAT_RESERVED', 'PAYMENT_PENDING', 'CONFIRMED'].includes(b.status);

              return (
                <div key={b.bookingId} className="card hover:shadow-card-hover transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {b.originIata ?? '✈'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">
                            {b.originIata && b.destinationIata
                              ? `${b.originIata} → ${b.destinationIata}`
                              : b.bookingRef}
                          </p>
                          <BookingStatusBadge status={b.status} />
                        </div>
                        <p className="text-sm text-gray-500">
                          {b.flightNumber && <>{b.flightNumber} &bull; </>}
                          {dep ? format(dep, 'dd MMM yyyy, HH:mm') : b.createdAt ? format(parseISO(b.createdAt), 'dd MMM yyyy') : ''}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Ref: <span className="font-mono font-semibold text-brand-600">{b.bookingRef}</span>
                          {b.passengerCount > 0 && <>&nbsp;&bull;&nbsp; {b.passengerCount} pax</>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="font-bold text-gray-900">
                        {b.currency} {Number(b.totalAmount).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          to={`/confirmation/${b.bookingRef}`}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          View
                        </Link>
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(b.bookingRef)}
                            disabled={cancelling === b.bookingRef}
                            className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancelling === b.bookingRef ? <Spinner size="sm" /> : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {page.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => load(currentPage - 1)}
                disabled={currentPage === 0}
                className="btn-secondary py-1.5 px-4 text-sm"
              >← Prev</button>
              <span className="flex items-center text-sm text-gray-500 px-2">
                Page {currentPage + 1} of {page.totalPages}
              </span>
              <button
                onClick={() => load(currentPage + 1)}
                disabled={currentPage >= page.totalPages - 1}
                className="btn-secondary py-1.5 px-4 text-sm"
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
