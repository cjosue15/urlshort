'use client';

import { deleteLink } from '@/server/actions/link';
import { LucideCopy, LucideTrash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import ShortEdit from './ShortEdit';

const URL = process.env.NEXT_PUBLIC_URL;

export interface Link {
  id: number;
  slug: string;
  url: string;
  visits: number;
}

function ShortCard(props: Link) {
  const { slug, visits, url } = props;

  const handleCopy = () => {
    const URL_TO_COPY = `${URL}/${slug}`;

    navigator.clipboard.writeText(URL_TO_COPY).then(() => {
      toast.success('Copied to clipboard', {
        description: URL_TO_COPY,
        closeButton: true,
      });
    });
  };

  const handleDelete = async () => {
    toast.promise(deleteLink(props.id), {
      loading: 'Deleting link...',
      success: 'Deleted successfully',
      error: 'Error deleting link',
    });
  };

  return (
    <div className='bg-gray-50 border border-gray-400 p-4 rounded-md'>
      <div className='flex items-center justify-between gap-2'>
        <span className='font-bold'>/{slug}</span>

        <div className='flex items-center gap-4'>
          <small>{visits} clicks</small>

          <div className='flex items-center gap-2'>
            <button className='cursor-pointer' onClick={handleCopy}>
              <LucideCopy size={14} />
            </button>

            <ShortEdit {...props} />

            <button className='cursor-pointer' onClick={handleDelete}>
              <LucideTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className='w-full mt-4'>
        <small className='block text-nowrap overflow-hidden text-ellipsis'>
          {url}
        </small>
      </div>
    </div>
  );
}

export default ShortCard;
