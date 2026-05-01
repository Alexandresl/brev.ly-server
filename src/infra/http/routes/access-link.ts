import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { accessLink } from '@/app/functions/access-link'
import { isRight, unwrapEither } from '@/shared/either'

export const accessLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/:shortUrl',
    {
      schema: {
        summary: 'Access and redirect a shortened link',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          302: z.null().describe('Redirects to the original URL'),
          404: z.object({ message: z.string() }).describe('Link not found'),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const link = await accessLink({ shortUrl })

      if (isRight(link)) {
        const { originalUrl } = unwrapEither(link)
        return reply.status(302).redirect(originalUrl)
      }

      const error = unwrapEither(link)

      switch (error.constructor.name) {
        case 'LinkNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
