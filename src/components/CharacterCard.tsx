import React from 'react';
import Img from './Img';
import { BRAND_NAME } from '@/lib/brand';

export type CardData = {
  id: string;
  name: string;
  realm: string;
  species: string;
  emoji: string;
  color: string;
  power: string;
  motto: string;
  avatarDataUrl?: string; // optional base64 image
};

export const CharacterCard: React.FC<{ data: CardData }> = ({ data }) => {
  const { name, realm, species, emoji, color, power, motto, avatarDataUrl } = data;

  return (
    <div
      className="nv-card"
      style={{
        border: `2px solid ${color || 'var(--nv-border)'}`,
        boxShadow: '0 6px 20px rgba(0,0,0,.08)',
      }}
    >
      <div className="nv-card__header" style={{ background: color || 'var(--nv-blue-50)' }}>
        <div className="nv-card__emoji" aria-hidden>
          {emoji || '🌱'}
        </div>
        <div className="nv-card__title">
          <div className="nv-card__name">{name || 'Navatar'}</div>
          <div className="nv-card__sub">
            {species || 'Species'} · {realm || 'Realm'}
          </div>
        </div>
      </div>

      <div className="nv-card__body">
        <div className="nv-card__avatar">
          {avatarDataUrl ? (
            <Img src={avatarDataUrl} alt={`${name} avatar`} />
          ) : (
            <div className="nv-card__avatar--placeholder">Add image</div>
          )}
        </div>
        <dl className="nv-card__facts">
          <div>
            <dt>Power</dt>
            <dd>{power || '—'}</dd>
          </div>
          <div>
            <dt>Motto</dt>
            <dd>{motto || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="nv-card__footer">{BRAND_NAME} • Character Card</div>
    </div>
  );
};
