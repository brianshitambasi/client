import React from 'react';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  as = 'input',
  options = []
}) {
  const cls = `form-control ${error ? 'is-invalid' : ''}`;
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold small">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {as === 'select' ? (
        <select className={cls} name={name} value={value} onChange={onChange}>
          <option value="">— Select —</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          className={cls}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={cls}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
