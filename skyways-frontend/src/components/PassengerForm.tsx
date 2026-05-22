import React from 'react';
import type { PassengerInput } from '../types';

interface Props {
  index: number;
  value: PassengerInput;
  onChange: (index: number, field: keyof PassengerInput, val: string) => void;
}

export default function PassengerForm({ index, value, onChange }: Props) {
  const set = (field: keyof PassengerInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange(index, field, e.target.value);

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Passenger {index + 1}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="label">First Name *</label>
          <input className="input" value={value.firstName} onChange={set('firstName')}
            placeholder="As on passport" required />
        </div>

        <div>
          <label className="label">Last Name *</label>
          <input className="input" value={value.lastName} onChange={set('lastName')}
            placeholder="As on passport" required />
        </div>

        <div>
          <label className="label">Date of Birth *</label>
          <input className="input" type="date" value={value.dateOfBirth} onChange={set('dateOfBirth')} required />
        </div>

        <div>
          <label className="label">Nationality *</label>
          <input className="input" value={value.nationality} onChange={set('nationality')}
            placeholder="e.g. Indian" required />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Passport Number *</label>
          <input className="input" value={value.passportNumber} onChange={set('passportNumber')}
            placeholder="e.g. A1234567" required />
        </div>

      </div>
    </div>
  );
}
