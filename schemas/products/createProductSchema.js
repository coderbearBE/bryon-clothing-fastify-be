module.exports = {
  type: "object",
  required: ["productCode", "descriptionBryon", "clothingType", "price"],
  properties: {
    productCode: { type: "string" },
    descriptionBryon: { type: "string" },
    clothingType: {
      type: "string",
      enum: ["ACCESSORY", "FOOTWEAR", "TEXTILE"],
    },
    retailFor: { type: "string", enum: ["MALE", "FEMALE"] },
    price: { type: "number", minimum: 0 },
  },
};
