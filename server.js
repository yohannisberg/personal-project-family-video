var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var path = require('path');
var session = require('express-session');
var config = require('./config')
var app = express();

var conn = massive.connectSync({
  connectionString : "postgres://postgres:jesus555@localhost:5433/personalProjectFamilyVideo"
});

app.set('db', conn);
const db=app.get('db');
db.schema(function(err, response){
  if(response){
    console.log('table init from server')
  } else {
    console.log(err);
  }
})
//we can export this by doing var app=module.exports=express()
app.use(bodyParser.json());
//so we don't need live-server
app.use(express.static(path.join(__dirname, 'dist/')));
//from joe- in controller, we require app, then we require db so we can use it
//REQUIRE CONTROLLERS AFTER YOU SET DB!!!

app.use(session({
  secret: config.password,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false
  // maxAge: (365 * 24 * 60 * 60 * 1000),
  // expires: false
}

}))

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
  // req.session.id = function(){
  //   let arr = '1234567890qwertyuiopasdfghjklzxcvbnm'
  //   let id=[];
  //   for(var i=0; i<9; i++){
  //     id.push(arr[Math.floor(Math.random()*35)])
  //   }
  //   console.log(id);
  //   return id.join('');
  // };
  const user=req.body.user;
  console.log(req.session.id)
  db.createAccount([user.first_name, user.last_name, user.email, user.password, req.session.id], function(err, account) {
    console.log('account', account)
    // req.session.user=account[0];
    console.log(req.session)
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
  db.shoppingCart([movie.original_title, movie.id, movie.poster_path, req.session.user[0].id], function(err, movie) {
    if(!err){
      console.log('worked :)')
      resp.send(movie)
    }
    else{
      console.log(err)
    }
  })
});

app.get('/api/sessionCheck', function(req, resp) {
  resp.status(200).send(req.sessionID)
})

// app.post('/api/signIn', function(req, resp) {
//   // console.log('this is from the server', req.body.account)
//   const account=req.body.account;
//   db.signIn([account.email, account.password], function(err, account) {
//     if(!err){
//       resp.status(200).send(account.data.object);
//     }
//   })
// })

app.post('/api/signIn', function(req, resp) {
  const account=req.body.account;
  db.signIn([account.email, account.password], function(err, account) {
    req.session.user=account;
    resp.status(200).send(account)
  })
})

app.post('api/findAccount', function(req, resp) {
  ('holy crap its working', req.body.id)
  db.findAccount([req.body.id], function(err, account) {
    resp.status(200).send(account)
  })
})

app.listen(port, function(){
  console.log("working")
})
