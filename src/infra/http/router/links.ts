import { FastifyInstance } from "fastify";
import type { FastifyPluginAsyncZod } from 'FastifyPluginAsyncZod'

export const linkRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/links', () => {
        return 'Hello World!'
    })
}