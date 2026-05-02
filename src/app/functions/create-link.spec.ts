import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { makeLinks } from '@/test/factories/make-links'
import { ShortUrlAlreadyExists } from '../errors/short-url-already-exists'
import { createLink } from './create-link'

describe('create link', () => {
  it('should be able to create a new link', async () => {
    const randomShort = `example-${randomUUID()}`

    const sut = await createLink({
      originalUrl: 'http://example.com',
      shortUrl: randomShort,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        link: expect.objectContaining({
          originalUrl: 'http://example.com',
          shortUrl: randomShort,
        }),
      })
    )
  })

  it('should not be able to create a link with an existing short URL', async () => {
    const randomShort = `existing-${randomUUID()}`

    await makeLinks({ shortUrl: randomShort })

    const sut = await createLink({
      originalUrl: 'http://example.com',
      shortUrl: randomShort,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExists)
  })
})
