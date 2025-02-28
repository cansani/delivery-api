import { prisma } from "@/database/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class DeliversStatusController {
  async update(request: FastifyRequest, reply: FastifyReply) {
    const statusParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = statusParamsSchema.parse(request.params)

    const statusBodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered'])
    })

    const { status } = statusBodySchema.parse(request.body)

    await prisma.delivery.update({
      data: {
        status,
      },
      where: {
        id
      }
    })

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: status
      }
    })

    return reply.send()
  }
}