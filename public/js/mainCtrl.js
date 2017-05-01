angular.module('familyVideo').controller('mainCtrl', function($scope){

$scope.searchBarClick=true;

$scope.searchBar = function() {
if($scope.searchBarClick){
  // $window.onclick = null;
  $scope.searchBarClick=false;
}
else{
  $scope.searchBarClick=true;
  }
}

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

})
