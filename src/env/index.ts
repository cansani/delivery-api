import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['dev', 'test', 'production']),
  JWT_SECRET: z.string()
})

const checkEnvironmentVariables = envSchema.safeParse(process.env)

if (checkEnvironmentVariables.success === false) {
  console.error('Variaveis de ambiente invalidas', checkEnvironmentVariables.error.format())

  throw new Error('Variaveis de ambiente invalidas')
}

export const env = checkEnvironmentVariables.data


