const argon2 = require("argon2");
const R = require("ramda");
const client = require("../../config/dbclient");
const loginUserSchema = require("../../schemas/users/loginUserSchema");
const loginUserResponseSchema = require("../../schemas/users/loginUserResponseSchema");
const registerUserSchema = require("../../schemas/users/registerUserSchema");

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
        const userResponse = await client.searchByValue({
          table: "users",
          searchAttribute: "email",
          searchValue: email,
          attributes: ["email", "firstname", "lastname"],
        });
        const existingUser = userResponse.data.shift();

        if (!R.isNil(existingUser))
          return fastify.httpErrors.badRequest("User already exists");

        const hashedPwd = await argon2.hash(password);

        const newUser = {
          ...request.body,
          password: hashedPwd,
        };

        await client.insert({
          table: "users",
          records: [newUser],
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
        const userResponse = await client.searchByValue({
          table: "users",
          searchAttribute: "email",
          searchValue: email,
          attributes: ["email", "firstname", "lastname", "password", "role"],
        });
        const existingUser = userResponse.data.shift();

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
