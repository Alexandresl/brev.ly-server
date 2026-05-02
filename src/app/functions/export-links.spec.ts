import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { makeLinks } from '@/test/factories/make-links'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const domainName = randomUUID()

    const link1 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link2 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link3 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link4 = await makeLinks({ originalUrl: `http://${domainName}.com` })
    const link5 = await makeLinks({ originalUrl: `http://${domainName}.com` })

    const sut = await exportLinks({
      searchQuery: domainName,
    })

    const generateCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generateCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generateCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generateCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(';'))

    expect(isRight(sut)).toBe(true)

    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'http://example.com/file.csv',
    })

    expect(csvAsArray).toEqual([
      ['ID', 'Original URL', 'Shorted URL', 'Clicks', 'Created at'],
      [
        link1.id,
        link1.originalUrl,
        link1.shortUrl,
        link1.clicks.toString(),
        expect.any(String),
      ],
      [
        link2.id,
        link2.originalUrl,
        link2.shortUrl,
        link2.clicks.toString(),
        expect.any(String),
      ],
      [
        link3.id,
        link3.originalUrl,
        link3.shortUrl,
        link3.clicks.toString(),
        expect.any(String),
      ],
      [
        link4.id,
        link4.originalUrl,
        link4.shortUrl,
        link4.clicks.toString(),
        expect.any(String),
      ],
      [
        link5.id,
        link5.originalUrl,
        link5.shortUrl,
        link5.clicks.toString(),
        expect.any(String),
      ],
    ])
  })
})
