module.exports = {
  type: "object",
  required: ["description_doltcini", "description_bryon", "price"],
  properties: {
    description_doltcini: { type: "string" },
    description_bryon: { type: "string" },
    price: { type: "number", minimum: 0 },
    additional_info: { type: "string" },
  },
};
