import bcrypt from "bcrypt";
import fp from"fastify-plugin";

const authDecorator = async (fastify, options) => {

  
    fastify.decorate("generateToken", (payload) => {
      return fastify.jwt.sign(payload);
    });


    fastify.decorate("authenticateBearerToken", async (request, reply) => {
      try {
        const token = getBearerToken(request);
        if (!token) {
          reply.status(401).send({ error: "Missing Bearer token" });
          return;
        }
  
        const decoded = await fastify.jwt.verify(token);
        request.user = decoded;
      } catch (err) {
        reply.status(401).send({ error: "Invalid Bearer token" });
      }
    });

    fastify.decorate("hashPassword", async (password) => {
           
       // Add the pepper and saltto the password
      const pepper=process.env.pepper;
      const salt = process.env.salt;
      const saltedPassword = password + pepper;
  
      // Hash the salted password with the generated salt
      const hashedPassword = await bcrypt.hash(saltedPassword, salt);
  
      return hashedPassword;
    });
  
    function getBearerToken(request) {
      const { authorization } = request.headers;
      if (!authorization) return null;
  
      const [scheme, token] = authorization.split(" ");
      if (scheme !== "Bearer") return null;
  
      return token;
    }
};

export default fp(authDecorator);

  
  