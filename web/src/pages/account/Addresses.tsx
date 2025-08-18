import React, { useState } from 'react';
import { useToast } from '../../components/ui/useToast';
import {
  Address,
  getAddresses,
  saveAddress,
  removeAddress,
  setDefault,
} from '../../lib/addresses';

const emptyAddress: Address = {
  id: '',
  name: '',
  line1: '',
  city: '',
  country: '',
};

 export default function Addresses() {
  const [list, setList] = useState<Address[]>(getAddresses());
  const [editing, setEditing] = useState<Address | null>(null);
  const toast = useToast();

  const refresh = () => setList(getAddresses());

  const startAdd = () => setEditing({ ...emptyAddress });
  const startEdit = (a: Address) => setEditing(a);

  const save = (addr: Address) => {
    const saved = saveAddress(addr);
    if (saved.isDefault) setDefault(saved.id);
    toast.success('Address saved');
    refresh();
    setEditing(null);
  };

  const del = (id: string) => {
    if (confirm('Delete this address?')) {
      removeAddress(id);
      refresh();
      toast.success('Address deleted');
    }
  };

  const makeDefault = (id: string) => {
    setDefault(id);
    refresh();
    toast.info('Default address updated');
  };

  return (
    <section className="page-container">
      <h1>Address Book</h1>
      {editing ? (
        <AddressForm
          initial={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button onClick={startAdd}>Add address</button>
      )}

      {list.length === 0 ? (
        <p>No addresses yet.</p>
      ) : (
        <div className="addr-grid" style={{ marginTop: '1rem' }}>
          {list.map((a) => (
            <div className="addr-card" key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{a.name}</strong>
                {a.isDefault && <span className="badge-default">Default</span>}
              </div>
              <div style={{ whiteSpace: 'pre-line', marginTop: 4 }}>
                {a.line1}
                {a.line2 ? `\n${a.line2}` : ''}
                {`\n${a.city}${a.region ? ', ' + a.region : ''} ${a.postal || ''}`}
                {`\n${a.country}`}
                {a.phone ? `\n${a.phone}` : ''}
              </div>
              <div className="actions" style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {!a.isDefault && (
                  <button onClick={() => makeDefault(a.id)}>Make default</button>
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
  const [value, setValue] = useState<Address>({ ...initial });

  const set = (field: keyof Address) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValue({ ...value, [field]: v });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.name || !value.line1 || !value.city || !value.country) {
      alert('Please fill required fields.');
      return;
    }
    onSave(value);
  };

  return (
    <form onSubmit={submit} className="form-grid" style={{ maxWidth: 420, marginTop: '1rem' }}>
      <input placeholder="Name" value={value.name} onChange={set('name')} />
      <input
        placeholder="Address line 1"
        value={value.line1}
        onChange={set('line1')}
      />
      <input
        placeholder="Address line 2"
        value={value.line2 || ''}
        onChange={set('line2')}
      />
      <input placeholder="City" value={value.city} onChange={set('city')} />
      <input
        placeholder="Region"
        value={value.region || ''}
        onChange={set('region')}
      />
      <input
        placeholder="Postal code"
        value={value.postal || ''}
        onChange={set('postal')}
      />
      <input
        placeholder="Country"
        value={value.country}
        onChange={set('country')}
      />
      <input placeholder="Phone" value={value.phone || ''} onChange={set('phone')} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, gridColumn: '1/3' }}>
        <input
          type="checkbox"
          checked={value.isDefault || false}
          onChange={set('isDefault')}
        />
        Default
      </label>
      <div className="actions" style={{ gridColumn: '1/3', marginTop: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

