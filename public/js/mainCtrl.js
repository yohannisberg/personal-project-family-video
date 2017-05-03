angular.module('familyVideo').controller('mainCtrl', function($scope, mainService){

$scope.searchBarClick=true;

$scope.openNav = function(){
  // document.getElementById("mySidenav").style.width = "calc(100%-54px)";
  document.getElementById("mySidenav").style.width = "93%";
  // document.getElementById("main").style.marginLeft = "calc(100%-54px)";
  document.getElementById("main").style.marginLeft = "93%";
}

$scope.closeNav = function(){
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("main").style.marginLeft = "0px";
}

$scope.controlData=function(query){
  mainService.getMovies(query).then(function(response){
    $scope.forHtml=response;
  })
}

$scope.sessionCheck=function(){
  mainService.checkSessions().then(function(response){
    console.log('this is the controller', response)

  })
 }

$scope.sessionCheck();

})
