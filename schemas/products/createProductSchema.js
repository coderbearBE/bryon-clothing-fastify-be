module.exports = {
  type: "object",
  required: [
    "productCode",
    "descriptionBryon",
    "clothingType",
    "retailFor",
    "price",
  ],
  properties: {
    productCode: { type: "string" },
    descriptionBryon: { type: "string" },
    clothingType: {
      type: "string",
      enum: ["ACCESSORY", "FOOTWEAR", "TEXTILE", "UNDERWEAR"],
    },
    retailFor: { type: "string", enum: ["DEFAULT", "MALE", "FEMALE"] },
    price: { type: "number", minimum: 0 },
  },
};
