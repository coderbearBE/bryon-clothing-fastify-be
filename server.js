'use strict';

const Fastify = require('fastify');
const app = require('./app.js'); // your plugin loader
require('dotenv').config();

const start = async () => {
  const fastify = Fastify({
    logger: true,
  });

  // Register the server plugin
  await fastify.register(app);

  const port = process.env.PORT || 3000; // Render will inject PORT env var

  try {
    await fastify.listen({ port, host: '0.0.0.0' }); // ✅ REQUIRED for Render
    console.log(`Server running on http://0.0.0.0:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
