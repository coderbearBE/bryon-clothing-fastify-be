module.exports = {
  type: "object",
  required: ["owner", "year", "products"],
  properties: {
    owner: { type: "string" },
    year: { type: "number" },
    products: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "description_doltcini",
          "description_bryon",
          "price",
          "quantity",
        ],
        properties: {
          id: { type: "string" },
          description_doltcini: { type: "string" },
          description_bryon: { type: "string" },
          price: { type: "number", minimum: 0 },
          additional_info: { type: "string" },
          quantity: { type: "number" },
        },
      },
    },
  },
};
