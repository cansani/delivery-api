import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hash } from 'bcrypt'
import { prisma } from "@/database/prisma";

import { AppError } from "@/utils/AppError";

export class UsersController {
  async store(request: FastifyRequest, reply: FastifyReply) {
    const createUserBodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const hashedPassword = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new AppError('Esse usuario já existe')
    }

    await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email
      }
    })

    reply.status(201).send({
      message: 'Usuario criado com sucesso.'
    })
  }

  async index(request: FastifyRequest, reply: FastifyReply) {
    const users = await prisma.user.findMany()

    reply.send({ users })
  }

  async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    reply.send({ user })
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new AppError('Este usuario não existe.')
    }

    const editUserBodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { name, email, password } = editUserBodySchema.parse(request.body)

    const passwordHashed = await hash(password, 6)

    await prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        email,
        password: passwordHashed
      }
    })

    return reply.send({
      message: 'Usuario atualizado com sucesso.'
    })
  }
}