const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationsSchema = new Schema({
    title: String, 
    coordinates: {
      lat: Number,
      lng: Number,
    },
    address: String,
    wikiSearchParam: String,
    yelpSearchParam: String,
    date: { type: Date, default: Date.now }
  });

const Locations = mongoose.model('Locations', locationsSchema);

module.exports = Locations;