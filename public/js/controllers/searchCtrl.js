angular.module('familyVideo').controller('searchCtrl', function($scope, mainService){

  $scope.testing='hi';

  mainService.testing=$scope.searchQuery;

  $scope.controlData=function(){
    mainService.getMovies().then(function(response){
      $scope.forHtml=response;
    })
  }

  $scope.controlData();



})
