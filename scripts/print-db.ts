import 'dotenv/config';

function mask(url: string | undefined) {
  if (!url) return '';
  return url.replace(/:\/\/.*@/, '://***@');
}

console.log('DATABASE_URL:', mask(process.env.DATABASE_URL));
console.log('DIRECT_URL:', mask(process.env.DIRECT_URL));
