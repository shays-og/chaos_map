const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttackSchema = new Schema({
    source_ip: { type: String, required: true },
    dest_ip: { type: String, required: true },
    source_geo: {
        country: String,
        lat: Number,
        lon: Number
    },
    dest_geo: {
        country: String,
        lat: Number,
        lon: Number
    },
    attack_type: { type: String, default: 'UDP Flood' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attack', AttackSchema);