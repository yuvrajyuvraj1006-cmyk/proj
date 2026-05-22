import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    phone:     '',
  });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await authApi.updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {success && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
      )}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSave} className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">First Name</label>
            <input className="input" value={form.firstName} onChange={set('firstName')} required />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input className="input" value={form.lastName} onChange={set('lastName')} required />
          </div>
        </div>
        <div>
          <label className="label">Email Address</label>
          <input className="input" type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input className="input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Spinner size="sm" className="mr-2" /> : null}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-6 card border-red-100">
        <h3 className="font-semibold text-gray-900 mb-2">Account Actions</h3>
        <button onClick={handleLogout} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
          Sign Out
        </button>
      </div>
    </div>
  );
}
