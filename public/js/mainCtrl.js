angular.module('familyVideo').controller('mainCtrl', function($scope, mainService, $rootScope){

$scope.searchBarClick=true;
$scope.shoppingCart=true;

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
    const sessId=response.data;
    console.log(sessId)
  })
 }

$scope.sessionCheck();

$scope.notSignedIn=true;

// $scope.findAccount=function(){
//   console.log('hi', $scope.sessId);
//   mainService.findAccount($scope.sessId).then(function(response){
//     console.log('JOFJOF', response)
//   })
// }
//
// $scope.findAccount();

$rootScope.$on('user', function(response){
  console.log(response)
  $scope.user=response;
})

$scope.findAccount=function(){
  mainService.findAccount().then(function(response){
    console.log('!!!This from the controller', response)
    $scope.user=response.data
  })
}

$scope.findAccount()

$scope.showCart=function(){
  $scope.shoppingCart=false;
  mainService.showCart().then(function(response){
    console.log('heres the object', response)
    $scope.cartItems=response.data;
  })
}

})
