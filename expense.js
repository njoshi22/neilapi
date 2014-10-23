var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
	name: String,
	amount: float
});

module.exports = mongoose.model('Expense',ExpenseSchema);