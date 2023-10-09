"use strict";

const fp = require("fastify-plugin");

/**
 * This plugin adds some JWT utilities for Fastify, internally it uses fast-jwt
 *
 * @see https://github.com/fastify/fastify-jwt
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });
});
