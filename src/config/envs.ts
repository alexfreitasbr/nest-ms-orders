import 'dotenv/config';
import * as joi from 'joi';

/**
 * Interface representing the expected environment variables.
 */
interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
}

/**
 * Joi schema for validating environment variables.
 * Ensures PORT is a required number and allows other unknown variables.
 */
const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { value, error } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

/**
 * Exported configuration object containing validated environment variables.
 */
export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
};
