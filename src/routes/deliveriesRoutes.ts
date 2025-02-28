import { DeliversStatusController } from './../controllers/DeliveriesStatusController';
import { DeliveriesController } from "@/controllers/DeliveriesController";
import { verifyJWT } from "@/middlewares/verifyJWT";
import { verifyUserRole } from '@/middlewares/verifyUserRole';
import { FastifyInstance } from "fastify";

export async function deliveriesRoutes(app: FastifyInstance) {
  const deliveriesController = new DeliveriesController()
  const deliversStatusController = new DeliversStatusController()

  app.addHook(`onRequest`, verifyJWT)
  app.addHook('onRequest', verifyUserRole('sale'))

  app.post('/', deliveriesController.store)
  app.get('/', deliveriesController.index)

  app.patch('/:id/status', deliversStatusController.update)
}