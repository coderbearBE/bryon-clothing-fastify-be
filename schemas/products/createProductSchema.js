module.exports = {
  type: "object",
  required: [
    "descriptionDoltcini",
    "descriptionBryon",
    "clothingType",
    "retailFor",
    "price",
  ],
  properties: {
    descriptionDoltcini: { type: "string" },
    descriptionBryon: { type: "string" },
    clothingType: {
      type: "string",
      enum: ["ACCESSORY", "FOOTWEAR", "TEXTILE"],
    },
    retailFor: { type: "string", enum: ["MALE", "FEMALE"] },
    price: { type: "number", minimum: 0 },
  },
};
