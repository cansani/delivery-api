import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';
import { compare } from 'bcrypt';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export class SessionsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const sessionBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { email, password } = sessionBodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new AppError('Credenciais invalidas.', 401)
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new AppError('Credenciais invalidas.', 401)
    }

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id
        }
      }
    )

    reply.status(200).send({
      acess_token: token
    })
  }
}