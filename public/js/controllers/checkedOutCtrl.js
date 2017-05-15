angular.module('familyVideo').controller('checkedOutCtrl', function($scope, mainService, $state, $timeout){

  $timeout(function() {
    $state.go('home');
  }, 5000);

  $timeout();

})
