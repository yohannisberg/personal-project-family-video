angular.module('familyVideo').service('mainService', function($http){

  this.getMovies=function(query){
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query="+query).then(function(response){
      return response.data.results;
    })
  }

  this.createAccount=function(user){
    console.log(user)
    return $http({
      method: 'POST',
      url: '/api/account/create',
      data: {
        user: user
      }
    }).then(function(response){
    })
  }

// DELETE THIS LATER
// app.post('/incidents', function(req, res) {
//   var data = [req.body.us_state, req.body.injury_id, req.body.cause_id];
//   db.newIncident(data, function(err, sqlResponse) {
//     res.send(sqlResponse)
//   });
// });

});
