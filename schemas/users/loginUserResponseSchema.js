module.exports = {
  type: "object",
  properties: {
    accesstoken: { type: "string" },
    email: { type: "string" },
    firstname: { type: "string" },
    lastname: { type: "string" },
    role: { type: "string", enum: ["MEMBER", "STAFF", "ADMIN"] },
    budget: { type: "number" },
  },
};
