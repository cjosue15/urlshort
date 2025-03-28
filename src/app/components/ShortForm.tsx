'use client';
import { LucideDices, LucideLoader } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateLink, createLinkSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkIfSlugExists, createLink } from '@/server/actions/link';
import { toast } from 'sonner';

const URL = process.env.NEXT_PUBLIC_URL;

function ShortForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateLink>({
    resolver: zodResolver(createLinkSchema),
  });

  const randomizeSlug = () => {
    const randomString = Math.random().toString(36).substring(2, 7);
    setValue('slug', randomString);
  };

  const onSubmit = async (values: CreateLink) => {
    try {
      setIsLoading(true);
      const slugExists = await checkIfSlugExists(values.slug);

      if (slugExists) {
        toast.error('Slug already exists. Please choose a different slug.');
        return;
      }

      await createLink(values);

      toast.success('Link created successfully!', {
        description: `Your shortened URL is: ${URL}/${values.slug}`,
        closeButton: true,
      });

      reset();
    } catch {
      toast.error('Error creating link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className='bg-gray-50 p-4 rounded-md shadow-sm border border-gray-300'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex gap-4 items-start'>
        <div className='flex-1'>
          <input
            type='text'
            className='border w-full  border-gray-300 rounded-md min-h-[40px] px-2'
            placeholder='https:// or http://'
            {...register('url')}
          />
          {errors.url && (
            <small className='text-red-500'>{errors.url.message}</small>
          )}
        </div>
        <button
          type='submit'
          className='bg-black text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2'
        >
          {isLoading && <LucideLoader size={16} className='animate-spin' />}
          Shorten
        </button>
      </div>
      <div className='mt-4'>
        <small>Customize your shortened URL by adding a custom alias.</small>

        <div className='flex items-center mt-4 gap-2'>
          <span className='font-bold'>urlshort.com</span>

          <input
            type='text'
            className='border border-gray-300 rounded-md min-h-[40px] p-2'
            placeholder='my-link'
            {...register('slug')}
          />

          <button
            type='button'
            className='bg-black text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2'
            onClick={randomizeSlug}
          >
            <LucideDices size={16} /> Randomize
          </button>
        </div>
        <div>
          {errors.slug && (
            <small className='text-red-500'>{errors.slug.message}</small>
          )}
        </div>
      </div>
    </form>
  );
}

export default ShortForm;
