angular.module('familyVideo').controller('searchCtrl', function($scope, mainService, $interval, $stateParams){

  $scope.addToCart=function(movieObject){
    mainService.addMovieToCart(movieObject).then(function(){
      // $scope.showCart();
    })
  };

  $scope.query=mainService.query;

  console.log('fuckfase', $stateParams.title)

  // $interval(function(){
  //   console.log('from search rontrol,', $scope.query, "num2",mainService.query)
  // }, 1000)

  // mainService.testing=$scope.searchQuery;

  // $scope.controlData();



})
