const { PrismaClient } = require("@prisma/client");
const R = require("ramda");
const createOrderSchema = require("../../schemas/orders/createOrderSchema");
const getCurrentOrderSchema = require("../../schemas/orders/getCurrentOrderSchema");

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
    "/all",
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
        const allOrdersForCurrentYear = await prisma.order.findMany({
          where: { year: new Date().getFullYear() },
        });

        reply.code(200).send(allOrdersForCurrentYear);
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
        const allOrdersForCurrentYear = await prisma.order.findMany({
          where: { year: new Date().getFullYear() },
        });

        let orderTotals = {};
        for (const order of allOrdersForCurrentYear) {
          for (const product of order.products) {
            const { productCode, size, quantity } = product;

            if (!orderTotals.hasOwnProperty(productCode)) {
              orderTotals[productCode] = [{ size, quantity }];
            } else {
              if (
                !orderTotals[productCode].some((item) => item.size === size)
              ) {
                orderTotals[productCode] = [
                  ...orderTotals[productCode],
                  { size, quantity },
                ];
              } else {
                orderTotals[productCode] = orderTotals[productCode].map(
                  (item) =>
                    item.size === size
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
                );
              }
            }
          }
        }

        reply.code(200).send(orderTotals);
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
