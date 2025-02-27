import { DeliveriesController } from "@/controllers/DeliveriesController";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

export async function deliveriesRoutes(app: FastifyInstance) {
  const deliveriesController = new DeliveriesController()

  app.addHook(`onRequest`, verifyJWT)

  app.post('/', deliveriesController.store)
  app.get('/', deliveriesController.index)
}