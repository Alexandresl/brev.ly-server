import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createLink } from '@/app/functions/create-link'
import { isRight, unwrapEither } from '@/shared/either'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a new shortened link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.string().url('Informe uma url válida.'),
          shortUrl: z
            .string()
            .regex(
              /^[a-z0-9-]+$/,
              'Informe uma url minúscula e sem espaço/caracter especial.'
            ),
        }),
        response: {
          201: z.null().describe('URL Cadastrada com Sucesso'),
          409: z.object({ message: z.string() }).describe('URL já existe.'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const link = await createLink({ originalUrl, shortUrl })

      if (isRight(link)) {
        return reply.status(201).send(null)
      }

      const error = unwrapEither(link)

      switch (error.constructor.name) {
        case 'ShortUrlAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    }
  )
}
