angular.module('familyVideo').controller('searchCtrl', function($scope, mainService, $interval){

  $scope.addToCart=function(movieObject){
    mainService.addMovieToCart(movieObject);
    $scope.showCart();
  };

  $scope.query=mainService.query;

  // $interval(function(){
  //   console.log('from search rontrol,', $scope.query, "num2",mainService.query)
  // }, 1000)

  // mainService.testing=$scope.searchQuery;

  // $scope.controlData();



})
