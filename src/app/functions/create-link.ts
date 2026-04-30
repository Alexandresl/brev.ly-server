import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ShortUrlAlreadyExists } from '../errors/short-url-already-exists'

const createLinkRequest = z.object({
  originalUrl: z.string(),
  shortUrl: z.string(),
})

type CreateLInkRequest = z.input<typeof createLink>

export async function createLink(
  input: CreateLInkRequest
): Promise<Either<ShortUrlAlreadyExists, { link: object }>> {
  const { originalUrl, shortUrl } = createLinkRequest.parse(input)

  const existingLink = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))

  if (existingLink.length > 0) {
    return makeLeft(new ShortUrlAlreadyExists())
  }

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortUrl,
    })
    .returning()

  return makeRight({ link: result[0] })
}
