import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John',
            email: "test@prisma.io",
            avatarUrl: 'http://github.com/pedrou103'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Test pool',
            code: 'BOL123',
            ownerId: user.id,

            participant: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            data: '2022-11-12T15:00:00.201Z',
            firstTeamContryCode: 'DE',
            secondTeamContryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            data: '2022-11-13T15:00:00.201Z',
            firstTeamContryCode: 'BR',
            secondTeamContryCode: 'AR',

            guessess: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,
                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        }
    })
}

main()