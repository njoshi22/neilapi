
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

var mongoose = require('mongoose');
// mongoose.connect('mongodb://db_admin:Ajinkya1!@ds041157.mongolab.com:41157/neilapidb'); //connect to our DB
mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI);
var Expense = require('./models/expense')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

var port = process.env.PORT || 1337; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// MIDDLEWEAR FOR ROUTER
router.use(function(req,res,next) {
	console.log('Something is happening');
	next(); //go to next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

// on routes that end in /expenses
// ----------------------------------------

router.route('/expenses')

.get(function(req,res) {
	Expense.find(function(err,expenses) { //return all expenses as the result
		if(err) { res.send(err); }

		res.json({"expenses": expenses});

	})
})


.post(function(req,res) {
	var expense = new Expense();
	expense.name = req.body.name;
	expense.amount = req.body.amount;

	//save the expense and check for errors
	expense.save(function(err) {
		if(err) {
			res.send(err);
		}

		res.json({message: 'Expense created!'});
	});
});

// on routes that end in /expenses/:expense_id
// ---------------------------------------------
router.route('/expenses/:expense_id')

.get(function(req,res) {
	Expense.findById(req.params.expense_id,function(err,expense) {
		if(err) {
			res.send(err);
		}

		res.json({"expense": expense});

	});
})

.put(function(req,res) {

	//first find the item we want
	Expense.findById(req.params.expense_id,function(err,expense) {
		if(err)
			res.send(err);

		if(req.body.name)
			expense.name = req.body.name; //update expense name
		
		if(req.body.amount)
			expense.amount = req.body.amount; //update amount

		//save the item
		expense.save(function(err) {
			if(err)
				res.send(err);

			res.json(200,{message: 'Update successful.'});
		});
	});
})

.delete(function(req,res) {
	Expense.remote({
		_id: req.params.bear_id
	},function(err,Expense) {
		if(err)
			res.send(err);

		res.json(200,{message: 'Successfully deleted'});
	});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
