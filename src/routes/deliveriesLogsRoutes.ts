import { DeliveriesLogsController } from "@/controllers/DeliveriesLogsController";
import { verifyJWT } from "@/middlewares/verifyJWT";
import { verifyUserRole } from '@/middlewares/verifyUserRole';
import { FastifyInstance } from "fastify";

export async function deliveriesLogsRoutes(app: FastifyInstance) {
  const deliveriesLogsController = new DeliveriesLogsController()

  app.addHook(`onRequest`, verifyJWT)

  app.post('/', { onRequest: verifyUserRole('sale') }, deliveriesLogsController.create)
  app.get('/:id', deliveriesLogsController.show)
}