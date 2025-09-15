import React from 'react';
import { Link } from 'react-router-dom';

export default function BackToMyNavatar() {
  return (
    <div className="mt-2">
      <Link to="/navatar" className="text-sm text-blue-500 hover:underline">
        ← Back to My Navatar
      </Link>
    </div>
  );
}
