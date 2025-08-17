import React, { useState } from 'react';
import { getAddresses, upsertAddress, deleteAddress, setDefaultAddress } from '../../lib/account';
import type { Address } from '../../lib/types';

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const US_POSTAL = /^\d{5}(-\d{4})?$/;

const emptyAddress = (): Address => ({
  id: crypto.randomUUID(),
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postal: '',
  country: 'US',
});

export default function Addresses() {
  const [book, setBook] = useState(getAddresses());
  const [editing, setEditing] = useState<Address | null>(null);

  const refresh = () => setBook(getAddresses());

  const startAdd = () => setEditing(emptyAddress());
  const startEdit = (a: Address) => setEditing(a);

  const save = (addr: Address) => {
    upsertAddress(addr);
    refresh();
    setEditing(null);
  };

  const del = (id: string) => {
    if (confirm('Delete this address?')) {
      deleteAddress(id);
      refresh();
    }
  };

  const makeDefault = (id: string) => {
    setDefaultAddress(id);
    refresh();
  };

  if (editing) {
    return (
      <section>
        <a href="/account/addresses">← Back</a>
        <h1>{book.list.find((a) => a.id === editing.id) ? 'Edit Address' : 'Add Address'}</h1>
        <AddressForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />
      </section>
    );
  }

  return (
    <section>
      <a href="/account">← Back to Account</a>
      <h1>Address Book</h1>
      <button onClick={startAdd}>Add Address</button>
      {book.list.length === 0 ? (
        <p>No addresses saved.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {book.list.map((a) => (
            <div
              key={a.id}
              style={{
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 8,
                padding: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{a.fullName}</strong>
                {book.defaultId === a.id && <span className="badge default">Default</span>}
              </div>
              <div style={{ whiteSpace: 'pre-line', marginTop: 4 }}>
                {a.address1}
                {a.address2 ? `\n${a.address2}` : ''}
                {`\n${a.city}, ${a.state} ${a.postal}`}
                {`\n${a.country}`}
                {`\n${a.email}`}
                {a.phone ? `\n${a.phone}` : ''}
              </div>
              <div className="actions" style={{ marginTop: 8 }}>
                {book.defaultId !== a.id && (
                  <button onClick={() => makeDefault(a.id)}>Set default</button>
                )}
                <button onClick={() => startEdit(a)}>Edit</button>
                <button onClick={() => del(a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface FormProps {
  initial: Address;
  onSave: (a: Address) => void;
  onCancel: () => void;
}

function AddressForm({ initial, onSave, onCancel }: FormProps) {
  const [value, setValue] = useState<Address>(initial);
  const [touched, setTouched] = useState<Record<keyof Address, boolean>>({
    id: false,
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

  const setField = (field: keyof Address) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const v = e.target.value.replace(/\s+/g, ' ').trimStart();
    setValue({ ...value, [field]: v });
  };
  const blur = (field: keyof Address) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const errors: Record<keyof Address, string> = {
    id: '',
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      alert('Please fix errors before saving.');
      setTouched(
        Object.keys(touched).reduce(
          (a, k) => ({ ...a, [k]: true }),
          {} as Record<keyof Address, boolean>
        )
      );
      return;
    }
    onSave(value);
  };

  return (
    <form onSubmit={submit} className="form-grid" style={{ maxWidth: 420 }}>
      <input
        placeholder="Full name"
        value={value.fullName}
        onChange={setField('fullName')}
        onBlur={blur('fullName')}
        data-invalid={touched.fullName && !!errors.fullName}
      />
      <input
        placeholder="Email"
        value={value.email}
        onChange={setField('email')}
        onBlur={blur('email')}
        data-invalid={touched.email && !!errors.email}
      />
      <input
        placeholder="Phone (optional)"
        value={value.phone || ''}
        onChange={setField('phone')}
        onBlur={blur('phone')}
      />
      <select
        value={value.country}
        onChange={setField('country')}
        onBlur={blur('country')}
        data-invalid={touched.country && !!errors.country}
      >
        <option value="">Country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="Other">Other</option>
      </select>
      <input
        placeholder="Address line 1"
        value={value.address1}
        onChange={setField('address1')}
        onBlur={blur('address1')}
        data-invalid={touched.address1 && !!errors.address1}
      />
      <input
        placeholder="Address line 2"
        value={value.address2 || ''}
        onChange={setField('address2')}
        onBlur={blur('address2')}
      />
      <input
        placeholder="City"
        value={value.city}
        onChange={setField('city')}
        onBlur={blur('city')}
        data-invalid={touched.city && !!errors.city}
      />
      <input
        placeholder="State"
        value={value.state}
        onChange={setField('state')}
        onBlur={blur('state')}
        data-invalid={touched.state && !!errors.state}
      />
      <input
        placeholder="Postal code"
        value={value.postal}
        onChange={setField('postal')}
        onBlur={blur('postal')}
        data-invalid={touched.postal && !!errors.postal}
      />
      <div className="actions" style={{ gridColumn: '1/3', marginTop: 8 }}>
        <button type="submit" disabled={!valid}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
