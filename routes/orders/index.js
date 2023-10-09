const client = require("../../config/dbclient");
const createOrderSchema = require("../../schemas/orders/createOrderSchema");
const getOrderTotalsResponseSchema = require("../../schemas/orders/getOrderTotalsResponseSchema");

module.exports = async function (fastify, opts) {
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
        const allOrdersResponse = await client.query(
          `SELECT * FROM bryonclothing.orders WHERE year=${new Date().getFullYear()}`
        );

        reply.code(200).send(allOrdersResponse.data);
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
        const getTotalsResponse = await client.query(
          "SELECT * FROM bryoncycling.orders"
        );

        reply.code(200).send(getTotalsResponse.data);
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
      try {
        const insertOrderResponse = await client.insert({
          table: "orders",
          records: [request.body],
        });

        reply.code(201).send(insertOrderResponse.data);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.badRequest("Failed to insert new order");
      }
    }
  );
};
