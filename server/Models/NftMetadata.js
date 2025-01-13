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
    available: {
      type: Boolean,
      required: [function () { return this.isNew; }, 'Store availability is required.'],
    },
    price: {
      type: Number,
      required: [function () { return this.isNew; }, 'Price is required.'],
    },
    season: {
      type: Number,
      required: [function () { return this.isNew; }, 'Season is required.'],
    },
    metadataUri: {
      type: String,
      required: false
    },
    creator: {
      type: String,
      required: false
    },
    created: {
      type: Number,
      required: false
    }
  },
  votes: {
    count: { type: Number, default: 0 }, // Total number of votes
    voters: { type: [String], default: [], unique: true }, // List of wallet addresses who voted
},
});

module.exports = mongoose.model('NftMetadata', NftMetadataSchema);

