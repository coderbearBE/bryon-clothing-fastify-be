const { PrismaClient } = require("@prisma/client");
const R = require("ramda");
const createOrderSchema = require("../../schemas/orders/createOrderSchema");
const getCurrentOrderSchema = require("../../schemas/orders/getCurrentOrderSchema");
const getOrderTotalsResponseSchema = require("../../schemas/orders/getOrderTotalsResponseSchema");

const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  // GET single order
  fastify.post(
    "/current",
    {
      onRequest: [fastify.authenticate],
      schema: { body: getCurrentOrderSchema },
    },
    async (request, reply) => {
      const { owner } = request.body;

      try {
        const currentOrder =
          (await prisma.order.findFirst({
            where: { owner, year: new Date().getFullYear() },
          })) ?? {};

        reply.code(200).send(currentOrder);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.badRequest("Server failure");
      }
    }
  );

  // GET all orders
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const { role } = fastify.jwt.decode(
        request.headers.authorization.split(" ").pop()
      );

      if (role === "MEMBER")
        return fastify.httpErrors.forbidden(
          "You are not allowed to perform this action"
        );

      try {
        // const allOrdersResponse = await client.query(
        //   `SELECT * FROM bryonclothing.orders WHERE year=${new Date().getFullYear()}`
        // );
        // reply.code(200).send(allOrdersResponse.data);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.notFound();
      }
    }
  );

  // GET product totals of all orders
  fastify.get(
    "/totals",
    {
      onRequest: [fastify.authenticate],
      schema: {
        response: {
          200: getOrderTotalsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { role } = fastify.jwt.decode(
        request.headers.authorization.split(" ").pop()
      );

      if (role === "MEMBER")
        return fastify.httpErrors.forbidden(
          "You are not allowed to perform this action"
        );

      try {
        // const getTotalsResponse = await client.query(
        //   "SELECT * FROM bryoncycling.orders"
        // );
        // reply.code(200).send(getTotalsResponse.data);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.notFound();
      }
    }
  );

  // POST order
  fastify.post(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: createOrderSchema,
      },
    },
    async (request, reply) => {
      const { owner, year } = request.body;

      try {
        const existingOrderForCurrentYear = await prisma.order.findFirst({
          where: { owner, year },
        });

        if (!R.isNil(existingOrderForCurrentYear))
          return fastify.httpErrors.badRequest(
            "Already placed an order for this year"
          );

        const createdOrder = await prisma.order.create({
          data: { ...request.body },
        });

        reply.code(201).send(createdOrder);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.badRequest("Failed to insert new order");
      }
    }
  );

  // PUT or PATCH order
};
