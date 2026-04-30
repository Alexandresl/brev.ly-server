import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { accessLink } from '@/app/functions/access-link'
import { createLink } from '@/app/functions/create-link'
import { deleteLink } from '@/app/functions/delete-link'
import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/shared/either'

export const linkRoute: FastifyPluginAsyncZod = async server => {
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

  server.get(
    '/links',
    {
      schema: {
        summary: 'List all links',
        tags: ['links'],
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortUrl: z.string(),
                clicks: z.number(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (_request, reply) => {
      const { links } = await getLinks()

      return reply.status(200).send({ links })
    }
  )

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

      try {
        const { originalUrl } = await accessLink({ shortUrl })

        return reply.status(302).redirect(originalUrl)
      } catch (error) {
        if (error instanceof Error && error.message === 'LINK_NOT_FOUND') {
          return reply.status(404).send({ message: 'Link não encontrado.' })
        }
        throw error
      }
    }
  )

  server.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Delete a link',
        tags: ['links'],
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null().describe('Link deleted successfully'),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      await deleteLink({ id })

      return reply.status(204).send(null)
    }
  )
}
