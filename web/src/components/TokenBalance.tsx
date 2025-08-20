import { useEffect, useState } from 'react';
import { getBalance } from '../lib/tokens';
export default function TokenBalance(){
  const [bal,set]=useState<number>(0);
  useEffect(()=>{ getBalance().then(set);},[]);
  return <div style={{fontWeight:600}}>Natur Tokens: {bal}</div>;
}
