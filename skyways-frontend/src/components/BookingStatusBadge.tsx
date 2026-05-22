import React from 'react';
import type { BookingStatus } from '../types';

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
  INITIATED:       { label: 'Processing',     classes: 'bg-yellow-100 text-yellow-700' },
  SEAT_RESERVED:   { label: 'Seat Reserved',  classes: 'bg-blue-100 text-blue-700' },
  PAYMENT_PENDING: { label: 'Awaiting Payment', classes: 'bg-orange-100 text-orange-700' },
  CONFIRMED:       { label: 'Confirmed',      classes: 'bg-green-100 text-green-700' },
  CANCELLED:       { label: 'Cancelled',      classes: 'bg-red-100 text-red-700' },
  REFUNDED:        { label: 'Refunded',       classes: 'bg-gray-100 text-gray-600' },
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const cfg = statusConfig[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${cfg.classes}`}>{cfg.label}</span>;
}
