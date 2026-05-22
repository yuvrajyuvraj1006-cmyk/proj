import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✈</span>
              <span className="text-xl font-bold text-white">SkyWays</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for seamless flight bookings worldwide.
              Thousands of routes, competitive fares, instant confirmation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Book</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Search Flights</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">24/7 Customer Care</span></li>
              <li><span className="text-gray-400">support@skyways.com</span></li>
              <li><span className="text-gray-400">+1-800-SKY-WAYS</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Powered By</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Razorpay Payments</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>Spring Boot Microservices</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>Apache Kafka</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>SendGrid Email</li>
              <li className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} SkyWays Airlines. All rights reserved.</span>
          <span>Spring Boot &bull; Microservices &bull; Kubernetes &bull; Kafka</span>
        </div>
      </div>
    </footer>
  );
}
