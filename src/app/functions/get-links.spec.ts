import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLinks } from '@/test/factories/make-links'
import { getLinks } from './get-links'

describe('get links', () => {
  it('should be able to get the links', async () => {
    const domainName = randomUUID()

    const link1 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link2 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link3 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link4 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link5 = await makeLinks({ originalUrl: `http://${domainName}.com` })

    const sut = await getLinks({
      searchQuery: domainName,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})

describe('get links', () => {
  it('should be able to get the links', async () => {
    const domainName = randomUUID()

    const link1 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link2 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link3 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link4 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link5 = await makeLinks({ originalUrl: `http://${domainName}.com` })

    let sut = await getLinks({
      searchQuery: domainName,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await getLinks({
      searchQuery: domainName,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})

it('should be able to get sorted links', async () => {
  const domainName = randomUUID()

  const link1 = await makeLinks({
    originalUrl: `http://${domainName}.com`,
    createdAt: new Date(),
  })

  const link2 = await makeLinks({
    originalUrl: `http://${domainName}.com`,
    createdAt: dayjs().subtract(1, 'day').toDate(),
  })

  const link3 = await makeLinks({
    originalUrl: `http://${domainName}.com`,
    createdAt: dayjs().subtract(2, 'day').toDate(),
  })

  const link4 = await makeLinks({
    originalUrl: `http://${domainName}.com`,
    createdAt: dayjs().subtract(3, 'day').toDate(),
  })

  const link5 = await makeLinks({
    originalUrl: `http://${domainName}.com`,
    createdAt: dayjs().subtract(4, 'day').toDate(),
  })

  let sut = await getLinks({
    searchQuery: domainName,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  })

  expect(isRight(sut)).toBe(true)
  expect(unwrapEither(sut).total).toEqual(5)
  expect(unwrapEither(sut).links).toEqual([
    expect.objectContaining({ id: link1.id }),
    expect.objectContaining({ id: link2.id }),
    expect.objectContaining({ id: link3.id }),
    expect.objectContaining({ id: link4.id }),
    expect.objectContaining({ id: link5.id }),
  ])

  sut = await getLinks({
    searchQuery: domainName,
    sortBy: 'createdAt',
    sortDirection: 'asc',
  })

  expect(isRight(sut)).toBe(true)
  expect(unwrapEither(sut).total).toEqual(5)
  expect(unwrapEither(sut).links).toEqual([
    expect.objectContaining({ id: link5.id }),
    expect.objectContaining({ id: link4.id }),
    expect.objectContaining({ id: link3.id }),
    expect.objectContaining({ id: link2.id }),
    expect.objectContaining({ id: link1.id }),
  ])
})
