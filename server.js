var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var path = require('path');
var session = require('express-session');
var config = require('./config');
var bcrypt = require('bcryptjs');

// HASH PASSWORD //
function hashPassword(password) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}

var app = module.exports = express();

var conn = massive.connectSync({
  connectionString : config.connString
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

}));

var passport = require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT ENDPOINTS //
app.post('/api/signIn', passport.authenticate('local', {
	successRedirect: '/api/findAccount'
}));
app.get('/api/logout', function(req, res, next) {
	req.logout();
	return res.status(200)
		.send('logged out');
});

// POLICIES //
var isAuthed = function(req, res, next) {
	if (!req.isAuthenticated()) return res.status(401)
		.send();
	return next();
};

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

// app.get('/api/test', function(req, res){
//   console.log('hi')
//   res.status(200).send('hello')
// })

app.post("/api/account/create", function(req, res, next) {

    const user=req.body.user;

		// Hash the users password for security
		user.password = hashPassword(user.password);

		user.email = user.email.toLowerCase();

		db.createAccount([user.first_name, user.last_name, user.email, user.password, req.session.id], function(err, user) {
			// If err, send err
			if (err) {
				console.log('Registration error: ', err);

				return res.status(500)
					.send(err);
			}

			delete user.password;

			res.status(200)
				.send(user);
		});
	}
// function(req,resp) {
//   //this is not the db folder- massive finds db by default
//   // req.session.id = function(){
//   //   let arr = '1234567890qwertyuiopasdfghjklzxcvbnm'
//   //   let id=[];
//   //   for(var i=0; i<9; i++){
//   //     id.push(arr[Math.floor(Math.random()*35)])
//   //   }
//   //   console.log(id);
//   //   return id.join('');
//   // };
//   const user=req.body.user;
//   console.log(req.session.id)
//   db.createAccount([user.first_name, user.last_name, user.email, user.password, req.session.id], function(err, account) {
//     console.log('account', account)
//     // req.session.user=account[0];
//     console.log(req.session)
//     if(!err){
//     resp.send(account);
//   }
//   else{
//     console.log(err)
//   }
//   })
// }
);

app.post("/api/addMovie", function(req, res) {
  const movie=req.body.movie;
  // db.shoppingCart([movie.original_title, movie.id, movie.poster_path, req.session.user[0].id],
    db.shoppingCart([movie.original_title, movie.id, movie.poster_path, req.user.id], function(err, movie) {
    if(!err){
      console.log('worked :)')
      res.send(movie)
    }
    else{
      console.log('didnt work', err)
    }
  })
});

app.post('/api/deleteMovie', function(req, res) {
	const movie=req.body.movie;
	console.log('from the server', movie)
	db.deleteFromCart([movie.api_id, req.user.id], function(err, movie) {
		if(!err){
			res.send(movie)
		}
	})
})

app.post('/api/deleteCart', function(req, res) {
	const userId=req.body.id;
	console.log('from da server', userId)
	db.deleteUserCart([userId], function(err, order) {
		if(!err){
			console.log('didnt work', err, 'it worked', order)
			res.send(order)
		}
	})
})

app.get('/api/sessionCheck', function(req, resp) {
  resp.status(200).send(req.sessionID)
})


app.get('/api/findAccount', function(req, res) {
  // ('holy crap its working', req.session.id)
  // db.findAccount([req.sessionId], function(err, account) {
  //   resp.status(200).send(account)
  // })
  if(!req.user){
    return res.status(404).send("User not found");
  }
  else{
    res.status(200).send(req.user);
  }
})

app.get('/api/getCart', function(req,res) {
	if(req.user==undefined){
		res.send('NotSignedIn')
	}
	else{
  db.getCartItems([req.user.id], function(err, items) {
    if(!err){
      return res.status(200).send(items)
    }

  })
}
})

app.listen(port, function(){
  console.log("working")
})
