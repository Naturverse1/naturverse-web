import React from 'react';
import { Link } from 'react-router-dom';

export default function BackToMyNavatar() {
  return (
    <div style={{ margin: '8px 0 16px' }}>
      <Link to="/navatar" style={{ fontWeight: 700, color: '#1f3db3', textDecoration: 'none' }}>
        ← Back to My Navatar
      </Link>
    </div>
  );
}
