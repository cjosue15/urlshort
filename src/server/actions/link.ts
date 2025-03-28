'use server';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { linksTable } from '../db/schema';
import { CreateLink } from '@/app/schemas';
import { revalidatePath } from 'next/cache';

interface LinkFromServerResponse {
  error: boolean;
  message: string;
  url?: string;
  redirect404?: boolean;
}

export const getAllLinks = async () => {
  return await db.select().from(linksTable).all();
};

export const checkIfSlugExists = async (slug: string) => {
  const response = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.slug, slug))
    .get();

  if (response) {
    return true;
  }

  return false;
};

export const createLink = async (values: CreateLink) => {
  await db.insert(linksTable).values({ ...values, visits: 0 });

  revalidatePath('/');
};

export const deleteLink = async (id: number) => {
  await db.delete(linksTable).where(eq(linksTable.id, id));

  revalidatePath('/');
};

export const getLinkFromServer = async (
  slug: string
): Promise<LinkFromServerResponse> => {
  try {
    const link = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.slug, slug))
      .get();

    if (!link) {
      return {
        error: true,
        message: 'Link not found',
        redirect404: true,
      };
    }

    await db
      .update(linksTable)
      .set({ visits: link.visits + 1 })
      .where(eq(linksTable.id, link.id));

    return {
      error: false,
      message: 'Link found',
      url: link.url,
    };
  } catch {
    return {
      error: true,
      message: 'Error fetching link',
    };
  }
};

export const updateLink = async (id: number, values: CreateLink) => {
  await db
    .update(linksTable)
    .set({ ...values })
    .where(eq(linksTable.id, id));

  revalidatePath('/');
};
