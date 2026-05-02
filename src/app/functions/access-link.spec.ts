import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLinks } from '@/test/factories/make-links'
import { LinkNotFound } from '../errors/link-not-found'
import { accessLink } from './access-link'

describe('access link', () => {
  it('should be able to access a link and increment clicks', async () => {
    const link = await makeLinks({ originalUrl: 'http://example.com' })

    const sut = await accessLink({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ originalUrl: 'http://example.com' })

    const updatedLink = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(updatedLink[0].clicks).toBe(link.clicks + 1)
  })

  it('should not be able to access an inexistent link', async () => {
    const sut = await accessLink({ shortUrl: 'inexistent-link' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})
