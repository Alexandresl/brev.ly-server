import { eq, sql } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from '../errors/link-not-found'

const accessLinkRequest = z.object({
  shortUrl: z.string(),
})

type AccessLinkRequest = z.input<typeof accessLinkRequest>

export async function accessLink(
  input: AccessLinkRequest
): Promise<Either<LinkNotFound, { originalUrl: string }>> {
  const { shortUrl } = accessLinkRequest.parse(input)

  const result = await db
    .update(schema.links)
    .set({
      clicks: sql`${schema.links.clicks} + 1`,
    })
    .where(eq(schema.links.shortUrl, shortUrl))
    .returning({
      originalUrl: schema.links.originalUrl,
    })

  if (result.length === 0) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight({ originalUrl: result[0].originalUrl })
}
