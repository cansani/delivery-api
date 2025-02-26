import { SessionsController } from "@/controllers/SessionsController";
import { FastifyInstance } from "fastify";

export async function sessionsRoutes(app: FastifyInstance) {
  const sessionsController = new SessionsController()

  app.post('/', sessionsController.create)
}