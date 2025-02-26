import fastify from "fastify";
import { appRoutes } from "./routes";
import { ZodError } from "zod";
import { AppError } from "./utils/AppError";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((err, _, reply) => {
  if (err instanceof ZodError) {
    reply.status(400).send({
      message: 'Erro de validacao',
      issues: err.format()
    })
  }

  if (err instanceof AppError) {
    reply.status(err.statusCode).send({
      message: err.errorMessage
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err)
  } else {
    //Datadog, Sentry, NewRelic
  }

  reply.status(500).send({
    message: 'Internal server error.'
  })
})

