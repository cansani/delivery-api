import { FastifyInstance } from "fastify";
import { usersRoutes } from "./usersRoutes";
import { sessionsRoutes } from "./sessionsRoutes";
import { deliveriesRoutes } from "./deliveriesRoutes";

export async function appRoutes(app: FastifyInstance) {
  app.register(usersRoutes, { prefix: '/users' })
  app.register(sessionsRoutes, { prefix: '/sessions' })
  app.register(deliveriesRoutes, { prefix: '/deliveries' })
}