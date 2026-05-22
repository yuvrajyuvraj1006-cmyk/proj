// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

// ─── Flights ─────────────────────────────────────────────────────────────────

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string; // ISO date yyyy-MM-dd
  returnDate?: string;
  passengers: number;
  cabinClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
}

export interface FlightDto {
  flightId: string;
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  originIata: string;
  originCity: string;
  destinationIata: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  availableSeats: number;
  basePrice: number;
  currency: string;
  cabinClass: string;
  source: 'GDS' | 'SKYSCANNER' | 'INTERNAL';
  stops: number;
}

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export interface PassengerInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  seatNumber?: string;
}

export interface CreateBookingRequest {
  flightId: string;
  cabinClass: string;
  totalAmount: number;
  currency: string;
  passengers: PassengerInput[];
  contactEmail: string;
  contactPhone: string;
}

export interface BookingSummary {
  bookingId: string;
  bookingRef: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  flightNumber: string;
  originIata: string;
  destinationIata: string;
  departureTime: string;
  arrivalTime: string;
  passengerCount: number;
  createdAt: string;
}

export type BookingStatus =
  | 'INITIATED'
  | 'SEAT_RESERVED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REFUNDED';

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amountInSmallestUnit: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
}

export interface PaymentResult {
  paymentId: string;
  status: 'SUCCESS' | 'FAILED';
  bookingRef: string;
}

// ─── API Wrapper ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

// ─── Razorpay global (loaded from checkout.js) ───────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
}
