var couchdb = require('couchdb');
var client = couchdb.createClient(5984, '127.0.0.1', { user: 'equationshare', password: 'wujnakHewd6' });
var db = client.db('equationshare');

var designDoc = {
  _id: '_design/equationshare',
  language: 'javascript',
  views: {
    'recent': {
      map: function(equation) {
        emit(equation.created, equation);
      }.toString(),
    }
  }
};

db.saveDoc(designDoc).then(function(response) {
  console.log('Updated design document.');
}, function(err) {
  console.log('Error updating design document: ' + require('util').inspect(err));
});