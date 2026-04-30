import { eq, sql } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

interface AccessLinkRequest {
  shortUrl: string
}

export async function accessLink({ shortUrl }: AccessLinkRequest) {
  // Fazemos um update atômico: incrementa o clique e já retorna a URL original
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
    throw new Error('LINK_NOT_FOUND')
  }

  return { originalUrl: result[0].originalUrl }
}
