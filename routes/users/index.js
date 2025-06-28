const argon2 = require("argon2");
const { PrismaClient } = require("@prisma/client");
const R = require("ramda");
const loginUserSchema = require("../../schemas/users/loginUserSchema");
const loginUserResponseSchema = require("../../schemas/users/loginUserResponseSchema");
const registerUserSchema = require("../../schemas/users/registerUserSchema");

const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  // POST register user
  fastify.post(
    "/register",
    {
      schema: {
        body: registerUserSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        });

        if (!R.isNil(existingUser))
          return fastify.httpErrors.badRequest("User already exists");
        const hashedPwd = await argon2.hash(password);

        await prisma.user.create({
          data: {
            ...request.body,
            password: hashedPwd,
          },
        });

        reply.code(201).send(`User created with email ${email}`);
      } catch (error) {
        return fastify.httpErrors.badRequest("Failed to register user");
      }
    }
  );

  // POST login user
  fastify.post(
    "/login",
    {
      schema: {
        body: loginUserSchema,
        response: {
          200: loginUserResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: {
              equals: email,
              mode: 'insensitive'
            }
          },
        });

        const isValidPassword = await argon2.verify(
          existingUser.password,
          password
        );

        if (!isValidPassword)
          return fastify.httpErrors.badRequest("Invalid email or password");

        const token = await fastify.jwt.sign(
          { email, role: existingUser.role },
          { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 8 }
        );

        reply.code(200).send({ ...existingUser, accesstoken: token });
      } catch (error) {
        return fastify.httpErrors.badRequest("Invalid email or password");
      }
    }
  );
};
