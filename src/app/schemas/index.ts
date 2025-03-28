import * as z from 'zod';

export const createLinkSchema = z.object({
  url: z.string().min(1, { message: 'URL is required.' }).url({
    message: 'Please enter a valid URL, Include http:// or https://',
  }),
  slug: z
    .string({ message: 'Slug is required.' })
    .min(4, { message: 'Slug must be at least 4 characters long.' })
    .regex(/^[a-zA-Z0-9_-]*$/, {
      message:
        'Custom short link must not contain any blank spaces or special characters.',
    }),
});

export type CreateLink = z.infer<typeof createLinkSchema>;
