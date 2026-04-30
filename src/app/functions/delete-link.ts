import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

interface DeleteLinkRequest {
  id: string
}

export async function deleteLink({ id }: DeleteLinkRequest) {
  await db.delete(schema.links).where(eq(schema.links.id, id))
}
