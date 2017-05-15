angular.module('familyVideo').controller('mainCtrl', function($scope, mainService, $rootScope, $state, $stateParams){

$scope.searchBarClick=true;
$scope.shoppingCart=true;
$scope.emptyCart=true;
$scope.searchBarClickMini=true;

$scope.openNav = function(){
  // document.getElementById("mySidenav").style.width = "calc(100%-54px)";
  document.getElementById("mySidenav").style.width = "90%";
  // document.getElementById("main").style.marginLeft = "calc(100%-54px)";
  // document.getElementById("main").style.marginLeft = "90%";
}

$scope.closeNav = function(){
  document.getElementById("mySidenav").style.width = "0px";
  // document.getElementById("main").style.marginLeft = "0px";
}

$scope.controlData=function(query){
  console.log($stateParams, $scope.searchQuery)

  $scope.forSearch=query;
  mainService.getMovies(query).then(function(response){
    $state.go('search', {title: $scope.searchQuery});
    $scope.forHtml=response;
    $scope.searchQuery='';
    $scope.searchBarClickMini=true;
  })
}

$scope.sessionCheck=function(){
  mainService.checkSessions().then(function(response){
    const sessId=response.data;
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
  mainService.showCart().then(function(response){
    console.log(response.data.length)
    if(response.data==='NotSignedIn' || response.data.length===0){
    $scope.emptyCart=false;
    $scope.shoppingCart=true;
  }
  else{
    $scope.shoppingCart=false;
    $scope.emptyCart=true;
    $scope.cartItems=response.data;

  }
  })
}

$scope.closeCart=function(){
  if(!$scope.shoppingCart){
    $scope.shoppingCart=true;
  }
}

$scope.closeEmptyCart=function(){
  if(!$scope.emptyCart){
      $scope.emptyCart=true;
}
}

$scope.closeSearchBar=function(){
  if(!$scope.searchBarClick){
    $scope.searchBarClick=true;
  }
}

$scope.closeMiniSearch=function(){
  if(!$scope.searchBarClickMini){
    $scope.searchBarClickMini=true;
  }
}

$scope.deleteItem=function(movie){
  mainService.deleteItem(movie).then(function(response){
    if(response){
      $scope.showCart();
    }
  })
}

})
