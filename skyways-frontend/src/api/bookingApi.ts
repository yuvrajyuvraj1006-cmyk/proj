import api from './apiConfig';
import type { ApiResponse, BookingSummary, CreateBookingRequest, PageResponse } from '../types';

export const bookingApi = {
  create: (data: CreateBookingRequest) =>
    api.post<ApiResponse<{ bookingId: string; bookingRef: string; status: string; message: string }>>
       ('/bookings', data).then((r) => r.data.data),

  getByRef: (bookingRef: string) =>
    api.get<ApiResponse<BookingSummary>>(`/bookings/${bookingRef}`).then((r) => r.data.data),

  getMyBookings: (page = 0, size = 10) =>
    api.get<ApiResponse<PageResponse<BookingSummary>>>('/bookings/my', { params: { page, size } })
       .then((r) => r.data.data),

  cancel: (bookingRef: string) =>
    api.post<ApiResponse<{ message: string }>>(`/bookings/${bookingRef}/cancel`).then((r) => r.data.data),
};
