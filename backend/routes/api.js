const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');
const Attack = require('../models/Attack'); // Assuming this is in ../models/Attack

// @route   POST /api/attack
// @desc    Receives attack data, saves it, and broadcasts it
// @access  Public
router.post('/', async (req, res) => {
    // We get the `io` object from the request object, which we'll attach in server.js
    const io = req.app.get('socketio');
    const { source_ip, dest_ip, attack_type } = req.body;

    if (!source_ip || !dest_ip) {
        return res.status(400).json({ msg: 'Please provide both source and destination IP.' });
    }

    const sourceGeo = geoip.lookup(source_ip);
    const destGeo = geoip.lookup(dest_ip);

    // We need valid geo-locations to visualize the data
    if (!sourceGeo || !destGeo) {
        return res.status(400).json({ msg: 'Could not geolocate one or both IPs.' });
    }

    const newAttack = new Attack({
        source_ip,
        dest_ip,
        attack_type: attack_type || 'UDP Flood',
        source_geo: {
            country: sourceGeo.country,
            lat: sourceGeo.ll[0],
            lon: sourceGeo.ll[1]
        },
        dest_geo: {
            country: destGeo.country,
            lat: destGeo.ll[0],
            lon: destGeo.ll[1]
        }
    });

    try {
        const savedAttack = await newAttack.save();

        // Broadcast the new attack data to all connected clients
        io.emit('new_attack', savedAttack);

        // Send a success response back to the simulator
        res.status(201).json(savedAttack);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;