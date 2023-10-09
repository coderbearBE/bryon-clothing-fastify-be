module.exports = {
  type: "object",
  required: ["email", "password", "role", "firstname", "lastname"],
  properties: {
    email: { type: "string", format: "email" },
    firstname: { type: "string" },
    lastname: { type: "string" },
    password: { type: "string" },
    role: { type: "string", enum: ["MEMBER", "STAFF", "ADMIN"] },
  },
};
