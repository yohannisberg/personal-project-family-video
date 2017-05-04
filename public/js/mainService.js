angular.module('familyVideo').service('mainService', function($http){
  //This 'this' is the mainService- used within a function
  let self=this;

  this.checkSessions=function(){
    return $http.get('/api/sessionCheck').then(function(response){
      // console.log('this is the sessionsCheck in the service', response)
      return response;
    })
  }

  this.getMovies=function(query){
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query="+query).then(function(response){
      return response.data.results;
    })
  }

  this.createAccount=function(user){
    console.log('this is the service', user)
    return $http({
      method: 'POST',
      url: '/api/account/create',
      data: {
        user: user
      }
    }).then(function(response){
      self.checkSessions();
    })
  }

  // this.logInUser=function(account){
  //   // console.log('this is the service', user)
  //   return $http({
  //     method: 'POST',
  //     url: '/api/signIn',
  //     data: {
  //       account: account
  //     }
  //   }).then(function(response){
  //     return response;
  //   })
  // }

  this.logInUser=function(account){
    // console.log('thisbetter work',account.email, account.password)
    return $http({
      method: 'POST',
      url: '/api/signIn',
      data: {
        account: account
      }
    }).then(function(response){
      console.log('IF THIS WORKS YOURE GOOD TO GO', response)
      return response;
    })
  }

  this.addMovieToCart=function(movie){
    return $http({
      method: 'POST',
      url: '/api/addMovie',
      data: {
        movie: movie
      }
    }).then(function(response){

    })
  }

});
