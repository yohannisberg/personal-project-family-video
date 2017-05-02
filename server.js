var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');

var conn = massive.connectSync({
  connectionString : "postgres://postgres:jesus555@localhost:5433/personalProjectFamilyVideo"
});

//we can export this by doing var app=module.exports=express()
var app = express();
app.use(bodyParser.json());

//from joe- in controller, we require app, then we require db so we can use it
//REQUIRE CONTROLLERS AFTER YOU SET DB!!!

//The dbs belows (except for the variable) can have any name
//set gives and key value pair to object- db is the key, conn is the value
// app.set('db', conn);

//so, db is the key, go get the value (which is conn)
// var db = app.get('db');

var port = 3000;

// app.post('/incidents', function(req, res) {
//   var data = [req.body.us_state, req.body.injury_id, req.body.cause_id];
//   db.newIncident(data, function(err, sqlResponse) {
//     res.send(sqlResponse)
//   });
// });

app.post("/account/create", function(req,resp) {
  //this is not the db folder- massive finds db by default
  db.getAllInjuries(function(err, injuries) {
    if(!err){
    resp.send(injuries);
  }
  });
});

app.listen(port, function(){
  console.log("working")
})
