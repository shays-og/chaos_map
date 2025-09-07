const axios = require('axios');

const API_URL = 'http://localhost:5000/api/attack';

// A simple function to generate a random IP address
function generateRandomIp() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// An array of possible attack types for variety
const ATTACK_TYPES = ['UDP Flood', 'SYN Flood', 'ICMP Ping', 'HTTP GET Flood'];

async function sendAttackData() {
    const attack = {
        source_ip: generateRandomIp(),
        dest_ip: generateRandomIp(),
        attack_type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)]
    };

    try {
        const response = await axios.post(API_URL, attack);
        console.log(`Success: Sent attack from ${response.data.source_geo.country} to ${response.data.dest_geo.country}`);
    } catch (error) {
        // We check for error.response.data to get the specific message from the server
        const errorMessage = error.response ? error.response.data.msg : error.message;
        console.error(`Error sending data: ${errorMessage}`);
    }
}

// Set an interval to send data.
// The value (e.g., 1500ms) controls the speed of attacks on the map.
const interval = 1500;
console.log(`Starting data simulator. Sending mock attack data to ${API_URL} every ${interval / 1000} seconds.`);
setInterval(sendAttackData, interval);