var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var path = require('path');
var app = express();

var conn = massive.connectSync({
  connectionString : "postgres://postgres:jesus555@localhost:5433/personalProjectFamilyVideo"
});

app.set('db', conn);
const db=app.get('db');
db.schema(function(err, response){
  if(response){
    console.log('table init')
  }
})
//we can export this by doing var app=module.exports=express()
app.use(bodyParser.json());
//so we don't need live-server
app.use(express.static(path.join(__dirname, 'dist/')));
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

app.get('/api/test', function(req, res){
  console.log('hi')
  res.status(200).send('hello')
})

app.post("/api/account/create", function(req,resp) {
  //this is not the db folder- massive finds db by default
  const user=req.body.user;
  db.createAccount([user.first_name, user.last_name, user.email, user.password], function(err, account) {
    if(!err){
    resp.send(account);
  }
  else{
    console.log(err)
  }
  })
});

app.post("/api/addMovie", function(req, resp) {
  const movie=req.body.movie;
  db.shoppingCart([movie.original_title, movie.api_id, movie.poster_path], function(err, movie) {
    if(!err){
      resp.send(movie)
    }
    else{
      console.log(err)
    }
  })
})

app.listen(port, function(){
  console.log("working")
})
