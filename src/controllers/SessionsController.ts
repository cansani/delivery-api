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
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d'
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', 
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({
        acess_token: token
      })
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign(
      {
        role: request.user.role
      },
      {
        sign: {
          sub: request.user.sub
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: request.user.role
      },
      {
        sign: {
          sub: request.user.sub,
          expiresIn: '7d'
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', 
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({
        acess_token: token
      })
  }
}