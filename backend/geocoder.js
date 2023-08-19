require('dotenv').config();

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',

    // Optional depending on the providers
    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    region: 'de',
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = async function (address) {
    const res = await geocoder.geocode(address);
    return res;
}
