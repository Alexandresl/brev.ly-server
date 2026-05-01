import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function makeLinks(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const domainName = faker.string.fromCharacters('abc', 6)

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: `http://www.${domainName}.com`,
      shortUrl: `${domainName}-${faker.number.int(100)}`,
      clicks: faker.number.int(100),
      ...overrides,
    })
    .returning()

  return result[0]
}
