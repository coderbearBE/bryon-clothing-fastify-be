module.exports = {
  type: "object",
  required: ["owner"],
  properties: {
    owner: {
      type: "object",
      required: ["firstname", "lastname", "email", "budget"],
      properties: {
        email: { type: "string", format: "email" },
        firstname: { type: "string" },
        lastname: { type: "string" },
        budget: { type: "number" },
      },
    },
  },
};
