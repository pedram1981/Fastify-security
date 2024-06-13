import * as service from "./service.js";
import userSchema from "./shema/userSchema.js";
import emailSchema from "./shema/emailShema.js";


const userRoutes = (fastify, options, done) => {
  fastify.get("/profile", {
    preHandler: fastify.authenticateBearerToken,
    schema: {
      query: emailSchema.query
    }
  }, async (request, reply) => {
    const { email } = request.query;

    const  result= await service.profile(email);
    if(result)
    return reply.status(200).send({ profile:result.outcome });
     else
     return reply.status(401).send({ error: "The profile is not exist" });
  });

  fastify.post("/login",{
    schema: {
      body: userSchema.body
    }
    }, async (request, reply) => {
    const { email, password } = request.body;
    const pass = await fastify.hashPassword({ email, password });
    const  result= await service.login(email,pass);
    if(result.success){
    const token = await fastify.generateToken({ email, password });
    return reply.status(200).send({ token });
    }
    else
     return reply.status(401).send({ error: "Invalid credentials" });

  });

  fastify.post("/signOut",{
    schema: {
      body: userSchema.body
    }
    }, async (request, reply) => {
    const { email, password, phone ,name } = request.body;
    const token = await fastify.hashPassword({ email, password });
    const result=await service.signOut(email, token, phone ,name);
    if(result.success)
     return reply.status(200).send({ message:result.outcome });
    else
    return reply.status(400).send({ eror:result.outcome });
    
  });

  done();
};

export default userRoutes;