import { prisma } from "@/database/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class DeliveriesController {
  async store(request: FastifyRequest, reply: FastifyReply ) {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string(),
    })

    const { user_id, description } = bodySchema.parse(request.body)

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description
      }
    })

    return reply.status(201).send()
  }

  async index(request: FastifyRequest, reply: FastifyReply) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return reply.status(200).send(deliveries)
  }
}