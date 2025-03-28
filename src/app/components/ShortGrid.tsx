import { getAllLinks } from '@/server/actions/link';
import React from 'react';
import ShortCard from './ShortCard';

async function ShortGrid() {
  const links = await getAllLinks();

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4'>
      {links.map((link) => (
        <ShortCard key={link.id} {...link} />
      ))}
    </div>
  );
}

export default ShortGrid;
