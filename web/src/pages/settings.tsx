import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ThemePref,
  getTheme,
  setTheme,
  getReducedMotion,
  setReducedMotion,
} from '../lib/prefs';
import { exportData, clearData } from '../lib/dataExport';

export default function Settings() {
  const [theme, setThemeState] = useState<ThemePref>(getTheme());
  const [reduced, setReduced] = useState<boolean>(getReducedMotion());

  const changeTheme = (t: ThemePref) => {
    setThemeState(t);
    setTheme(t);
  };

  const changeReduced = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReduced(e.target.checked);
    setReducedMotion(e.target.checked);
  };

  const handleExport = () => {
    exportData();
  };

  const handleClear = () => {
    if (confirm('Clear local data?')) {
      clearData();
      window.location.reload();
    }
  };

  return (
    <main className="container settings-page">
      <h1>Settings</h1>

      <section className="setting-block">
        <h2>Theme</h2>
        <label>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => changeTheme('light')}
          />
          Light
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => changeTheme('dark')}
          />
          Dark
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            value="system"
            checked={theme === 'system'}
            onChange={() => changeTheme('system')}
          />
          System
        </label>
      </section>

      <section className="setting-block">
        <h2>Motion</h2>
        <label>
          <input
            type="checkbox"
            checked={reduced}
            onChange={changeReduced}
          />
          Reduce motion
        </label>
      </section>

      <section className="setting-block">
        <h2>Data</h2>
        <button className="button" onClick={handleExport}>
          Export my data
        </button>
        <button
          className="button"
          style={{ background: 'var(--danger)', color: 'var(--bg)' }}
          onClick={handleClear}
        >
          Clear local data
        </button>
      </section>

      <nav className="quick-links">
        <Link to="/account/orders">Orders</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </main>
  );
}
