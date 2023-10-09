const harperive = require("harperive");

const { Client } = harperive;

const DB_CONFIG = {
  harperHost: process.env.INSTANCE_URL,
  username: process.env.INSTANCE_USERNAME,
  password: process.env.INSTANCE_PASSWORD,
  schema: process.env.INSTANCE_SCHEMA, // optional params
};

const client = new Client(DB_CONFIG);

module.exports = client;
