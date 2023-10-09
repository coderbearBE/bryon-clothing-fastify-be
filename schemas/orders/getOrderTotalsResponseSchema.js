module.exports = {
  type: "array",
  items: {
    type: "object",
    required: ["product_id", "description_doltcini", "total_count"],
    properties: {
      product_id: { type: "string" },
      description_doltcini: { type: "string" },
      total_count: { type: "number" },
    },
  },
};
