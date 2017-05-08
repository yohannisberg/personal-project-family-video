angular.module('familyVideo').controller('searchCtrl', function($scope, mainService){

  $scope.addToCart=function(movieObject){
    mainService.addMovieToCart(movieObject)
    $scope.showCart();
  };

  // mainService.testing=$scope.searchQuery;

  // $scope.controlData();



})
