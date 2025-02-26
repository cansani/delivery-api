import { UsersController } from "@/controllers/UsersController";
import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  const usersController = new UsersController()

  app.post('/', usersController.store)
  app.get('/', usersController.index)
  app.get('/:id', usersController.show)
  app.put('/:id', usersController.update)
}