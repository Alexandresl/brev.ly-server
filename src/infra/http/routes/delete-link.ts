import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteLink } from '@/app/functions/delete-link'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
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
