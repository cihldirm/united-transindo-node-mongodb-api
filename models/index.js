const dbConfig = require('../config/db')
const mongoose = require('mongoose')
const userModel = require('./userModel')

module.exports = {
	mongoose,
	url: dbConfig.url,
	users: userModel(mongoose)
}
