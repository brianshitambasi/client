import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function PhoneInputField({ label, value, onChange, error, required }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold small">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <PhoneInput
        country={'ke'} // Default to Kenya
        value={value}
        onChange={(phone) => onChange(phone)} // returns string of digits e.g. '254742137305'
        enableSearch={true}
        inputClass={`form-control ${error ? 'is-invalid' : ''}`}
        containerClass="w-100"
        inputStyle={{ width: '100%', height: '42px', borderRadius: '10px', borderColor: error ? '#dc3545' : '#e6e9f2' }}
        buttonStyle={{ borderRadius: '10px 0 0 10px', borderColor: error ? '#dc3545' : '#e6e9f2' }}
        dropdownStyle={{ width: '300px' }}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
