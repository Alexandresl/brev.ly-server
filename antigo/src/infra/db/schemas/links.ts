import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
