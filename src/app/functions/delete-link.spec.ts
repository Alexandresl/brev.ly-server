import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { makeLinks } from '@/test/factories/make-links'
import { deleteLink } from './delete-link'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const link = await makeLinks()

    await deleteLink({ id: link.id })

    const deletedLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(deletedLink.length).toBe(0)
  })
})
