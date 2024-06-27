"use strict";

const fp = require("fastify-plugin");

/**
 * This plugin adds some JWT utilities for Fastify, internally it uses fast-jwt
 *
 * @see https://github.com/fastify/fastify-cors
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require("@fastify/cors"), {
    origin: ["localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  fastify.addHook("onSend", function (req, reply, payload, done) {
    req.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Origin", "*");

    done(null, payload);
  });
});
