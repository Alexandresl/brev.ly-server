import { desc } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function getLinks() {
  const links = await db
    .select()
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))

  return { links }
}
