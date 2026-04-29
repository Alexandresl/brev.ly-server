import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const linkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Save a route',
        body: z.object({
          name: z.string(),
          password: z.string().optional(),
        }),
        response: {
          201: z.object({ urlId: z.string() }),
          409: z.object({ message: z.string() }).describe('URL already exists.'),
        }
      },
    },
    async (request, reply) => {
      return reply.status(201).send({
        urlId: '12310',
      })
    }
  )
}
