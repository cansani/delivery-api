import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class DeliveriesLogsController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const deliveriesLogsControllerBodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string()
    })

    const { delivery_id, description } = deliveriesLogsControllerBodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id
      }
    })

    if (!delivery) {
      throw new AppError('Essa entrega nao existe.', 404)
    }

    if (delivery.status === 'processing') {
      throw new AppError('O status atual e de processando, troque para enviado.', 404)
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description
      }
    })

    return reply.status(201).send()
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const deliveryLogParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = deliveryLogParamsSchema.parse(request.params)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id
      },
      include: {
        logs: true,
        user: true
      }
    })

    const isCustomer = request.user.role === 'customer'

    if (isCustomer && request.user.sub !== delivery?.userId) {
      throw new AppError('O usuario pode ver somente os proprios pedidos.')
    }

    return reply.send(delivery)
  }
}