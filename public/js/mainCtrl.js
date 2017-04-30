angular.module('familyVideo').controller('mainCtrl', function($scope, $window){

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

})
