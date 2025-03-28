import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const linksTable = sqliteTable('links', {
  id: integer('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  url: text('url').notNull(),
  visits: integer('visits').notNull().default(0),
});
