import MyNavatar from '../pages/navatar';
import PickNavatar from '../pages/navatar/pick';
import UploadNavatar from '../pages/navatar/upload';
import CardPage from '../pages/navatar/card';
import MintPage from '../pages/navatar/mint';
import MarketplacePage from '../pages/navatar/marketplace';
import GeneratePage from '../pages/navatar/generate';

export const navatarRoutes = [
  { path: 'navatar', element: <MyNavatar /> },
  { path: 'navatar/pick', element: <PickNavatar /> },
  { path: 'navatar/upload', element: <UploadNavatar /> },
  { path: 'navatar/card', element: <CardPage /> },
  { path: 'navatar/mint', element: <MintPage /> },
  { path: 'navatar/marketplace', element: <MarketplacePage /> },
  { path: 'navatar/generate', element: <GeneratePage /> },
];
