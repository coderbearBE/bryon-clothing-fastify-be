module.exports = {
  type: "object",
  required: ["owner", "year", "products"],
  properties: {
    owner: {
      type: "object",
      required: ["firstname", "lastname", "email"],
      properties: {
        email: { type: "string", format: "email" },
        firstname: { type: "string" },
        lastname: { type: "string" },
      },
    },
    year: { type: "number" },
    products: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "productCode",
          "descriptionBryon",
          "clothingType",
          "price",
          "size",
          "quantity",
        ],
        properties: {
          id: { type: "string" },
          productCode: { type: "string" },
          descriptionBryon: { type: "string" },
          clothingType: { type: "string" },
          retailFor: { type: "string" },
          price: { type: "number", minimum: 0 },
          size: { type: "string" },
          quantity: { type: "number" },
        },
      },
    },
  },
};
