export default function OrdersPage() {
  const orders = JSON.parse(localStorage.getItem('natur_orders') || '[]');
  if (!orders.length) return <p>No orders yet.</p>;

  return (
    <div className="page">
      <h1>Your Orders</h1>
      <ul className="orders">
        {orders.map((o: any) => (
          <li key={o.id} className="order">
            <div className="left">
              {o.navatar?.image ? (
                <img
                  src={o.navatar.image}
                  alt="navatar"
                  style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #fff' }}
                />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#222' }} />
              )}
            </div>
            <div className="right">
              <div>
                <strong>#{o.id}</strong> — {o.totalNatur} NATUR
              </div>
              <small>{new Date(o.createdAt).toLocaleString()}</small>
              <div className="items">
                {o.items.map((it: any, i: number) => (
                  <div key={i} className="cart-line">
                    <img
                      src={it.previewUrl ?? it.thumb}
                      alt=""
                      className="preview-thumb"
                    />
                    <div>
                      {it.qty} × {it.name}
                      {it.options && (
                        <small style={{ marginLeft: 8, opacity: 0.8 }}>
                          {Object.entries(it.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
