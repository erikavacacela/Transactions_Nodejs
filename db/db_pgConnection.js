var pg = require('pg');

var conString = "postgres://postgres:12345678@127.0.0.1/db_transaction";
var client = new pg.Client(conString);

client.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})


exports.connect = function(done){
    client.connect(function(err, db) {
        if (err) return done(err)
        console.log("Se conecto a DB postgres")
        done()
    })
}

exports.getClient = function()
{
    return client
}
