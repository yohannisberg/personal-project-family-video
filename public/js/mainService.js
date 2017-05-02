angular.module('familyVideo').service('mainService', function($http){

  this.getMovies=function(){
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query="+this.testing).then(function(response){
      return response.data.results;
    })
  }

  // this.getMovies=function(){
  //   return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query="+$scope.searchQuery).then(function(response){
  //     return response.data.results;
  //   })
  // }

});
