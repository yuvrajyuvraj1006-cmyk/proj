import api from './apiConfig';
import type { ApiResponse, CreateOrderResponse, PaymentResult, VerifyPaymentRequest } from '../types';

export const paymentApi = {
  createOrder: (bookingId: string, amount: number, currency: string) =>
    api.post<ApiResponse<CreateOrderResponse>>('/payments/create-order', { bookingId, amount, currency })
       .then((r) => r.data.data),

  verifyPayment: (data: VerifyPaymentRequest) =>
    api.post<ApiResponse<PaymentResult>>('/payments/verify', data).then((r) => r.data.data),

  getPaymentStatus: (bookingId: string) =>
    api.get<ApiResponse<{ status: string; paymentId?: string }>>(`/payments/status/${bookingId}`)
       .then((r) => r.data.data),
};
