import { FastifyInstance } from "fastify";
import { map, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/:id/games', {
        onRequest: [authenticate],
    }, async (req) => {
        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(req.params)

        const games = await prisma.game.findMany({
            orderBy: {
                data: 'desc',
            },
            include: {
                guessess: {
                    where : {
                        participant: {
                            userId: req.user.sub,
                            poolId: id,
                        }
                    }
                }
            }
        })

        return { 
            games: games.map(game => {
                return {
                    ...game,
                    guess: game.guessess.length > 0 ? game.guessess[0] : null,
                    guessess: undefined,
                }
            }) 
        }
    })
}