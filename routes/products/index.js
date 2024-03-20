const { PrismaClient } = require("@prisma/client");
const R = require("ramda");
const createProductSchema = require("../../schemas/products/createProductSchema");

const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  //GET products
  fastify.get("/", async (request, reply) => {
    try {
      // const allProductsResponse = await client.query(
      //   "SELECT * FROM bryonclothing.products"
      // );
      // reply.code(200).send(allProductsResponse.data);
    } catch (error) {
      console.error(error);
      return fastify.httpErrors.notFound();
    }
  });

  //POST single product
  fastify.post(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: createProductSchema,
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

      const { descriptionDoltcini } = request.body;

      try {
        const existingProduct = await prisma.product.findFirst({
          where: { descriptionDoltcini },
        });

        if (!R.isNil(existingProduct))
          return fastify.httpErrors.badRequest("Product already exists");

        const createdProduct = await prisma.product.create({
          data: { ...request.body },
        });

        reply.code(201).send(createdProduct);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.badRequest("Failed to insert new product");
      }
    }
  );
};
