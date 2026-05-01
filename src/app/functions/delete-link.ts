import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

const deleteLinkRequest = z.object({
  id: z.string(),
})

type DeleteLinkRequest = z.input<typeof deleteLinkRequest>

export async function deleteLink(input: DeleteLinkRequest): Promise<void> {
  const { id } = deleteLinkRequest.parse(input)

  await db.delete(schema.links).where(eq(schema.links.id, id))
}
