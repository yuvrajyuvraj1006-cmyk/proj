export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Support Centre</h1>
        <p className="text-gray-500 text-lg">We're here for you 24 hours a day, 7 days a week.</p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {[
          { icon: '📧', title: 'Email Support', detail: 'support@skyways.com', sub: 'Reply within 2 hours', color: 'from-blue-500 to-sky-400' },
          { icon: '📞', title: 'Phone Support', detail: '+1-800-SKY-WAYS',    sub: 'Available 24/7',       color: 'from-emerald-500 to-teal-400' },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow`}>
              {c.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">{c.title}</h3>
            <p className="text-blue-600 font-semibold text-sm mb-1">{c.detail}</p>
            <p className="text-gray-400 text-xs">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {[
            { q: 'How do I cancel my booking?',                    a: 'Go to My Bookings, find your booking and click the Cancel button. Refunds are processed within 10–15 business days.' },
            { q: 'When will I receive my booking confirmation?',   a: "Confirmation emails are sent instantly after payment is verified. Check your spam folder if you don't see it within a few minutes." },
            { q: 'Can I change my flight after booking?',          a: 'Flight changes are not supported online. Please contact our support team and we will assist you.' },
            { q: 'How long does the refund take?',                 a: 'Refunds are processed within 10–15 business days back to your original payment method.' },
            { q: 'What cabin classes are available?',              a: 'We offer Economy, Business, and First Class across all routes, subject to availability.' },
          ].map((item) => (
            <div key={item.q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <p className="font-semibold text-gray-900 mb-1.5">❓ {item.q}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
