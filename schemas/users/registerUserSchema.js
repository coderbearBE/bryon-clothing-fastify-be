module.exports = {
  type: "object",
  required: ["email", "password", "role", "firstname", "lastname", "gender"],
  properties: {
    email: { type: "string", format: "email" },
    firstname: { type: "string" },
    lastname: { type: "string" },
    gender: { type: "string", enum: ["MALE", "FEMALE"] },
    budget: { type: "number" },
    password: { type: "string" },
    role: { type: "string", enum: ["MEMBER", "STAFF", "ADMIN"] },
  },
};
