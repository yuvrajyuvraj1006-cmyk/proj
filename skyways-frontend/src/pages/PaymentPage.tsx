import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import type { CreateOrderResponse, FlightDto, RazorpayOptions, RazorpaySuccessResponse } from '../types';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location      = useLocation();
  const navigate      = useNavigate();
  const { user }      = useAuth();

  const state = location.state as { bookingRef?: string; flight?: FlightDto; totalAmount?: number; currency?: string } | undefined;
  const bookingRef  = state?.bookingRef ?? '';
  const flight      = state?.flight;
  const totalAmount = state?.totalAmount ?? 0;
  const currency    = state?.currency ?? 'INR';

  const [order, setOrder]       = useState<CreateOrderResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);
  const [orderError, setOrderError]     = useState('');
  const [paymentError, setPaymentError] = useState('');
  const fetched = useRef(false);

  useEffect(() => {
    if (!bookingId || fetched.current) return;
    fetched.current = true;
    paymentApi.createOrder(bookingId, totalAmount, currency)
      .then(setOrder)
      .catch((e) => setOrderError(e?.response?.data?.message ?? 'Failed to create payment order.'))
      .finally(() => setLoading(false));
  }, [bookingId, totalAmount, currency]);

  const handleRazorpay = () => {
    if (!order || !bookingId) return;
    setPaymentError('');
    setPaying(true);

    if (typeof window.Razorpay !== 'function') {
      setPaymentError('Razorpay failed to load. Please check your internet connection and try again.');
      setPaying(false);
      return;
    }

    const options: RazorpayOptions = {
      key:         order.keyId,
      amount:      order.amountInSmallestUnit,
      currency:    order.currency,
      order_id:    order.razorpayOrderId,
      name:        'SkyWays Airlines',
      description: `Booking Reference: ${bookingRef}`,
      prefill: {
        name:  `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
      },
      theme: { color: '#2563eb' },
      handler: async (response: RazorpaySuccessResponse) => {
        try {
          await paymentApi.verifyPayment({
            razorpayOrderId:   response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            bookingId:         bookingId!,
          });
          navigate(`/confirmation/${bookingRef}`, { replace: true, state: { flight, totalAmount, currency } });
        } catch (e: any) {
          setPaymentError(e?.response?.data?.message ?? 'Payment verification failed.');
          setPaying(false);
        }
      },
      modal: { ondismiss: () => setPaying(false) },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      setPaymentError('Failed to open payment window. Please try again.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Preparing secure checkout…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 page-enter">
      <div className="text-center mb-8">
        <span className="text-5xl">💳</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Complete Payment</h1>
        <p className="text-sm text-gray-500 mt-1">Secure payment powered by Razorpay</p>
      </div>

      {flight && (
        <div className="card mb-6 bg-brand-50 border border-brand-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900">
                {flight.originIata} → {flight.destinationIata}
              </p>
              <p className="text-sm text-gray-500">{flight.airlineName} &bull; {flight.flightNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Booking Ref</p>
              <p className="font-mono font-bold text-brand-700 text-sm">{bookingRef}</p>
            </div>
          </div>
        </div>
      )}

      {order && (
        <div className="card mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Amount</span>
              <span className="font-medium text-gray-900">
                {order.currency} {(order.amountInSmallestUnit / 100).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Method</span>
              <span className="font-medium text-gray-900">Razorpay (Cards / UPI / Wallets)</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Razorpay Order ID</span>
              <span className="font-mono text-xs text-gray-500 truncate max-w-[160px]">{order.razorpayOrderId}</span>
            </div>
          </div>
        </div>
      )}

      {orderError && !order && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{orderError}</div>
      )}

      {paymentError && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{paymentError}</div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleRazorpay}
          disabled={!order || paying}
          className="btn-primary w-full py-3 text-base"
        >
          {paying ? <Spinner size="sm" className="mr-2" /> : <span className="mr-2">🔒</span>}
          {paying ? 'Processing…' : `Pay ${order ? `${order.currency} ${(order.amountInSmallestUnit / 100).toLocaleString()}` : ''}`}
        </button>

        <button onClick={() => navigate(-1)} disabled={paying} className="btn-secondary w-full">
          Cancel &amp; Go Back
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        🔒 Your payment is encrypted and processed securely via Razorpay.
        PII is protected with 3-DES encryption.
      </p>
    </div>
  );
}
