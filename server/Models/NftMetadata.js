const mongoose = require('mongoose');

const NftMetadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  external_link: { type: String, required: true },
  attributes: [
    {
      trait_type: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  properties: {
    files: [
      {
        uri: { type: String, required: false },
        type: { type: String, required: true },
      },
    ],
    category: { type: String, required: true },
  },
  storeInfo: {
    available: {type: Boolean, required: true},
    price: {type: Number, required: true},
    season: {type: Number, required: true}
  }
});

module.exports = mongoose.model('NftMetadata', NftMetadataSchema);

