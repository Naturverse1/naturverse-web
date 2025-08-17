import React, { useEffect, useRef, useState } from 'react';
import type { Shipping } from '../../lib/orders';

export type ShippingFormProps = {
  value: Shipping;
  onChange: (next: Shipping) => void;
  onContinue: () => void; // only called when valid
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const US_POSTAL = /^\d{5}(-\d{4})?$/;

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const CA_PROVINCES = [
  'AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'
];

export default function ShippingForm({ value, onChange, onContinue }: ShippingFormProps) {
  const [touched, setTouched] = useState<Record<keyof Shipping, boolean>>({
    fullName: false,
    email: false,
    phone: false,
    address1: false,
    address2: false,
    city: false,
    state: false,
    postal: false,
    country: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('natur_shipping', JSON.stringify(value));
    } catch {}
  }, [value]);

  const setField = (field: keyof Shipping) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const v = e.target.value.replace(/\s+/g, ' ').trimStart();
    onChange({ ...value, [field]: v });
  };

  const blur = (field: keyof Shipping) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const errors: Record<keyof Shipping, string> = {
    fullName: value.fullName.trim() ? '' : 'Required',
    email: EMAIL_RE.test(value.email) ? '' : 'Invalid email',
    phone: '',
    address1: value.address1.trim() ? '' : 'Required',
    address2: '',
    city: value.city.trim() ? '' : 'Required',
    state: value.state.trim() ? '' : 'Required',
    postal:
      value.country === 'US'
        ? US_POSTAL.test(value.postal) ? '' : 'Invalid postal code'
        : value.postal.trim() ? '' : 'Required',
    country: value.country.trim() ? '' : 'Required',
  };

  const valid = Object.values(errors).every((e) => !e);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid) {
      onContinue();
      return;
    }
    // mark all touched and scroll to first invalid
    setTouched(
      Object.keys(touched).reduce(
        (a, k) => ({ ...a, [k]: true }),
        {} as Record<keyof Shipping, boolean>
      )
    );
    const first = formRef.current?.querySelector('[data-invalid="true"]') as
      | HTMLElement
      | undefined;
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const stateField = () => {
    if (value.country === 'US') {
      return (
        <select
          value={value.state}
          onChange={setField('state')}
          onBlur={blur('state')}
          data-invalid={!!errors.state}
        >
          <option value="">State</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      );
    }
    if (value.country === 'CA') {
      return (
        <select
          value={value.state}
          onChange={setField('state')}
          onBlur={blur('state')}
          data-invalid={!!errors.state}
        >
          <option value="">Province</option>
          {CA_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        placeholder="State/Province/Region"
        value={value.state}
        onChange={setField('state')}
        onBlur={blur('state')}
        data-invalid={!!errors.state}
      />
    );
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="field" style={{gap:8}}>
      <div className="row">
        <div className="field">
          <input
            placeholder="Full name"
            value={value.fullName}
            onChange={setField('fullName')}
            onBlur={blur('fullName')}
            data-invalid={!!errors.fullName}
          />
          {touched.fullName && errors.fullName && (
            <div className="field-error">{errors.fullName}</div>
          )}
        </div>
        <div className="field">
          <input
            placeholder="Email"
            value={value.email}
            onChange={setField('email')}
            onBlur={blur('email')}
            data-invalid={!!errors.email}
          />
          {touched.email && errors.email && (
            <div className="field-error">{errors.email}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <input
            placeholder="Phone (optional)"
            value={value.phone || ''}
            onChange={setField('phone')}
            onBlur={blur('phone')}
          />
        </div>
        <div className="field">
          <select
            value={value.country}
            onChange={setField('country')}
            onBlur={blur('country')}
            data-invalid={!!errors.country}
          >
            <option value="">Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="Other">Other</option>
          </select>
          {touched.country && errors.country && (
            <div className="field-error">{errors.country}</div>
          )}
        </div>
      </div>

      <div className="field">
        <input
          placeholder="Address line 1"
          value={value.address1}
          onChange={setField('address1')}
          onBlur={blur('address1')}
          data-invalid={!!errors.address1}
        />
        {touched.address1 && errors.address1 && (
          <div className="field-error">{errors.address1}</div>
        )}
      </div>

      <div className="field">
        <input
          placeholder="Address line 2 (optional)"
          value={value.address2 || ''}
          onChange={setField('address2')}
          onBlur={blur('address2')}
        />
      </div>

      <div className="row">
        <div className="field">
          <input
            placeholder="City"
            value={value.city}
            onChange={setField('city')}
            onBlur={blur('city')}
            data-invalid={!!errors.city}
          />
          {touched.city && errors.city && (
            <div className="field-error">{errors.city}</div>
          )}
        </div>
        <div className="field">{stateField()}</div>
      </div>

      <div className="field">
        <input
          placeholder="Postal code"
          value={value.postal}
          onChange={setField('postal')}
          onBlur={blur('postal')}
          data-invalid={!!errors.postal}
        />
        {touched.postal && errors.postal && (
          <div className="field-error">{errors.postal}</div>
        )}
      </div>

      <div style={{marginTop:12}}>
        <button type="submit" disabled={!valid}>
          Continue
        </button>
      </div>
    </form>
  );
}

