import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl">✈</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join SkyWays and start booking flights</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input className="input" value={form.firstName} onChange={set('firstName')} placeholder="John" required autoFocus />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input className="input" value={form.lastName} onChange={set('lastName')} placeholder="Doe" required />
              </div>
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input className="input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" required />
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input className="input" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <Spinner size="sm" className="mr-2" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
