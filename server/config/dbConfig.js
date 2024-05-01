const mongoose = require('mongoose');
mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on('connected', () => { console.log('connection successful'); });
connection.on('error', () => { console.log('connection error'); });

module.exports = mongoose;