const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	id_product: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},	
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},	
	stock: {
		type: Number,
		required: true
	},	
	en_last_unit: {
		type: Number,
		required: true
	}
});

mongoose.model('Product', ProductSchema);







