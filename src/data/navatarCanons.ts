import catalog from './navatar-catalog.json';

export type CanonNavatar = {
  id: string;
  title: string;
  url: string;
};

const CANONS: CanonNavatar[] = (catalog as any[]).map(({ id, title, src }) => ({
  id,
  title,
  url: src,
}));

export default CANONS;
