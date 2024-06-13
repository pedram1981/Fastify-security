import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import dotenvSafe from "dotenv-safe";
import path from "path";
import url from "url";
import fastifyJwt from "@fastify/jwt";
import userRoute from "./src/features/user/controller.js";
import AjvErrors from "ajv-errors";
import  securityPlugin  from "./src/infrastructure/auth/securityPlugin.js";

const __filename =url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
dotenvSafe.config({
    allowEmptyValues: true,
    example:path.resolve(__dirname, ".env.example"),
    path: path.resolve(__dirname, ".env"),
  });
} catch (error) {
    if (error instanceof dotenvSafe.MissingEnvVarsError) {
      console.error("Missing environment variables:", error.missing);
      process.exit(1);
    } else {
      throw error;
    }
  }
  
const app =fastify({
    ajv: {
      customOptions: {
        allErrors: true,
        jsonPointers: true
      },
      plugins: [
        AjvErrors
      ]
    },
    logger: false

  });

  const jwtOptions = {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: "1d" }
  };
  app.register(fastifyJwt, jwtOptions);

  // authotication
  app.register(securityPlugin);

const port = process.env.port;

app.register(cors, {
    origin: [process.env.address],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept","x-access-token"],
    credentials: true,
    maxAge: 86400
  });

  //security-related HTTP headers
app.register(helmet);

// Configure rate limiting
const blockedIPs = new Set();
app.register(rateLimit, {
  max: 4, // Max requests per window per IP
  timeWindow: "1 minute", // Time window in milliseconds
  keyGenerator: (req) => req.ip, // Use the client's IP address as the key
  errorResponseBuilder: (req) => {
    const ip = req.ip;
    if (!blockedIPs.has(ip)) {
      blockedIPs.add(ip);
      app.log.error({ error: new Error("Too many requests from this IP address"), ip }, "Rate limit exceeded");
      app.addHook("onResponse", (request, reply, done) => {
        reply.header("X-Ratelimit-Block", "true");
        done();
      });
    }
    return { error: "Too many requests from this IP address" };
  },
});

// Apis
app.register(userRoute, { prefix: "/api/v1/user" });

const start = async () => {
        app.listen({ port }, (err) => {
        if (err) {
          process.exit(1);
        }
        console.log(`Server running on port ${port}`);
      });
  };
  
  start();