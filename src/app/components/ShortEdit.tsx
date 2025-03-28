import * as Dialog from '@radix-ui/react-dialog';
import { LucideEdit, LucideLoader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateLink, createLinkSchema } from '../schemas';
import { useState } from 'react';
import { Link } from './ShortCard';
import { checkIfSlugExists, updateLink } from '@/server/actions/link';
import { toast } from 'sonner';

const ShortEdit = (props: Link) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLink>({
    resolver: zodResolver(createLinkSchema),
    values: {
      slug: props.slug,
      url: props.url,
    },
  });

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: CreateLink) => {
    try {
      setIsLoading(true);

      const slugExists = await checkIfSlugExists(values.slug);
      if (slugExists) {
        toast.error('Slug already exists. Please choose a different slug.');
        return;
      }

      await updateLink(props.id, values);
      toast.success('Link updated successfully!');
      handleCancel();
    } catch {
      toast.error('Error updating link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className='cursor-pointer'>
          <LucideEdit size={14} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed bg-black/80 inset-0 bg-blackA6 data-[state=open]:animate-overlayShow' />
        <Dialog.Content className='fixed bg-white left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow'>
          <Dialog.Title className='m-0 text-[17px] font-medium text-mauve12'>
            Edit link
          </Dialog.Title>
          <Dialog.Description title='Edit link'></Dialog.Description>

          <form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <label
                htmlFor='slug'
                className='text-sm font-semibold block mb-2'
              >
                Slug
              </label>

              <input
                type='text'
                className='bg-white w-full border border-gray-400 rounded-md text-base p-2'
                {...register('slug')}
              />
              {errors.slug && (
                <small className='text-red-500'>{errors.slug.message}</small>
              )}
            </div>
            <div className='mb-4'>
              <label htmlFor='url' className='text-sm font-semibold block mb-2'>
                URL
              </label>

              <input
                id='url'
                type='text'
                className='bg-white w-full border border-gray-400 rounded-md text-base p-2'
                {...register('url')}
              />

              {errors.url && (
                <small className='text-red-500'>{errors.url.message}</small>
              )}
            </div>

            <div className='flex mt-4 gap-4 items-center justify-end'>
              <button
                type='button'
                className='text-black hover:bg-black/10 px-4 py-2 rounded-md cursor-pointer'
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type='submit'
                className='flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md cursor-pointer'
                disabled={isLoading}
              >
                {isLoading && (
                  <LucideLoader size={16} className='animate-spin' />
                )}
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShortEdit;
