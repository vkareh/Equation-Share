/**
 * EquationShare
 */
var express = require('express');
var couchdb = require('couchdb');
var utils = require('./lib/utils');

var app = module.exports = express.createServer();

var client = couchdb.createClient(5984, '127.0.0.1', { user: 'equationshare', password: 'wujnakHewd6'});
var db = client.db('equationshare');

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(request, response) {
  response.render('index', {
    title: 'EquationShare',
    equations: '',
    input: '',
  });
});

app.get('/about', function(request, response) {
  response.render('about', {
    title: 'EquationShare',
  });
});

app.get('/recent', function(request, response) {
  db.view('equationshare', 'recent', {'descending': true, 'limit': 100}).then(function(result) {
    var recent = result.rows.map(function(equation) {
      return equation.value;
    });
    response.render('recent', {
      title: 'EquationShare',
      recent: recent,
    });
  });
});

app.get('/:id', function(request, response) {
  db.openDoc(request.params.id).then(function(doc) {
    if (doc && doc.equation) {
      response.render('equation', {
        title: 'EquationShare',
        equations: doc.equation.input.split('\r\n'),
        input: doc.equation.input,
      });
    }
    else {
      response.send('cannot find equation ' + request.params.id, 404);
    }
  });
});

app.post('*', function(request, response) {
  equation = request.body;
  equation._id = utils.random(5);
  equation.created = new Date().getTime();
  equation.equation.input = utils.trim(equation.equation.input);
  db.saveDoc(equation).then(function(result) {
    response.redirect('/' + result.id);
  });
});

app.listen(3000);
console.log('EquationShare server listening on port %d in %s mode', app.address().port, app.settings.env);
