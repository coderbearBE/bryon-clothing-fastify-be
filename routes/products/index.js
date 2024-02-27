const createProductSchema = require("../../schemas/products/createProductSchema");

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

      try {
        // const insertProductResponse = await client.insert({
        //   table: "products",
        //   records: [request.body],
        // });
        // reply.code(201).send(insertProductResponse.data);
      } catch (error) {
        console.error(error);
        return fastify.httpErrors.badRequest("Failed to insert new product");
      }
    }
  );
};
